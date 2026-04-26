import { createReport, getDangerStatsByDepartament, getReportById, getReports, getReportsByTypeWithPercentage } from "./reports.service.js";

export const createReportController = async (req, res, next) => {
    try {
        const userIp = req.ip

        const savedReport = await createReport(req.body, userIp, req.files)

        return res.status(201).send({ message: "Tu reporte ha sido recibido. Gracias por ayudar a mantener Guatemala más segura." })

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).send({ message: error.message })
        }
        return res.status(500).send({ message: "Ocurrió un error, intenta de nuevo." })
    }
}

export const getReportsController = async (req, res) => {
    try {
        const response = await getReports()

        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ message: "Ocurrió un error, intenta de nuevo, por favor." })
    }
}

export const getReportByIdController = async (req, res) => {
    try {
        const report = await getReportById(req.params.id)

        if (!report) {
            return res.status(404).send({ message: 'Reporte no encontrado' })
        }

        return res.status(200).send(report)
    } catch (error) {
        return res.status(500).send({ message: "Ocurrió un error, intenta de nuevo, por favor." })
    }
}

export const getReportsByTypeWithPercentageController = async (req, res) => {
    try {
        const response = await getReportsByTypeWithPercentage()

        return res.status(200).send(response[0])
    } catch (error) {
        return res.status(500).send({ message: "Ocurrió un error, intenta de nuevo, por favor." })
    }
}

export const getDangerStatsByDepartamentController = async (req, res) => {
    try {
        const response = await getReportsByTypeWithPercentage()

        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ message: "Ocurrió un error, intenta de nuevo, por favor." })
    }
}