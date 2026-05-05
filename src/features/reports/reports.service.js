import Report from './reports.model.js'
import { GoogleGenAI } from '@google/genai'
import crypto from 'crypto'
import { v2 as cloudinary } from 'cloudinary'
import { validateCreateReport } from './reports.validation.js'
import { buildIncidentPrompt } from './reports.prompt.js'
import { upload } from './middlewares/upload.js'
import { uploadFile } from '../../config/cloudinary.js'

export const createReport = async (reportData, ip, files) => {
    const { error } = validateCreateReport(reportData)

    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ')
        const validationError = new Error(errorMessage)
        validationError.statusCode = 400
        throw validationError
    }

    const mediasUrls = files?.length > 0
        ? await Promise.all(files.map((file) => uploadFile(file.buffer)))
        : []

    const newReport = new Report({
        ...reportData,
        media: mediasUrls,
        ipHash: ip ? hashIp(ip) : null,
        status: 'pending',
        reportedAt: new Date()
    })

    const savedReport = await newReport.save()

    moderateReportWithAI(savedReport._id).catch(err => {
        console.error(`Error en moderación IA: ${err}`)
    })

    return savedReport
}

export const moderateReportWithAI = async (reportId) => {
    const report = await Report.findById(reportId)

    if (!report) return

    try {
        const aiResult = await analyzeReportWithAI(
            report.title,
            report.description,
            report.type
        )

        await Report.findByIdAndUpdate(reportId, {
            $set: {
                'aiModeration.coherence': aiResult.coherence,
                'aiModeration.clarity': aiResult.clarity,
                'aiModeration.detail': aiResult.detail,
                'aiModeration.credibility': aiResult.credibility,
                'aiModeration.classificationCorrect': aiResult.classificationCorrect,
                'aiModeration.scoreGeneral': aiResult.scoreGeneral,
                'aiModeration.problemsDetected': aiResult.problemsDetected,
                'aiModeration.summary': aiResult.summary,
                'aiModeration.spam_score': aiResult.spam_score,
                'aiModeration.flags': aiResult.flags,
                status: aiResult.spam_score > 51 ? 'under_review' : 'approved'
            }
        })
    } catch (error) {
        console.error(`Error al analizar con IA: ${error}`)
        await Report.findById(reportId, { status: 'under_review' })
    }
}

const analyzeReportWithAI = async (title, description, type) => {
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: buildIncidentPrompt(title, description, type)
    })

    return JSON.parse(response.text)
}

const hashIp = (ip) => {
    return crypto.createHash('sha256')
        .update(ip + (process.env.IP_HASH_SALT || 'default-salt'))
        .digest('hex');
};

export const getReports = async () => {
    return await Report.find().select('-ipHash')
}

export const getReportById = async (id) => {
    return await Report.findById(id).select('-ipHash')
}

export const getReportsByTypeWithPercentage = async () => {

    return await Report.aggregate([
        {
            $group: {
                _id: '$type',
                count: { $sum: 1 },
            }
        },
        {
            $group: {
                _id: null,
                totalReports: { $sum: '$count' },
                types: { $push: '$$ROOT' }
            }
        },
        {
            $project: {
                _id: 0,
                types: {
                    $map: {
                        input: '$types',
                        as: 'tipo',
                        in: {
                            type: '$$tipo._id',
                            count: '$$tipo.count',
                            percentage: {
                                $multiply: [
                                    { $divide: ['$$tipo.count', '$totalReports'] },
                                    100
                                ]
                            },
                        }
                    }
                }
            }
        },
    ])
}

export const getDangerStatsByDepartament = async () => {
    return await Report.aggregate([
        {
            $group: {
                _id: '$location.departmentId',
                count: { $sum: 1 },
                avgSeverity: { $avg: '$severity' }
            }
        },
        { $sort: { count: -1 } }
    ])
}

export const getStatistics = async (query) => {
    const actions = {
        total: async () => {
            return Report.countDocuments()
        },
        getDepartment: async () => {
            const data = await getDangerStatsByDepartament()
            return data.slice(0, 5)
        }
    }
    
    let response = {}

    for (const key in query) {
        const value = query[key]
        
        const isValid = value === 'true'

        if (isValid) {
            response[key] = await actions[key]();
        }
    }

    return response
}