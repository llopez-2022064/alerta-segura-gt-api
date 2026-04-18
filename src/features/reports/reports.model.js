import { Schema, model } from "mongoose";

const reportSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [200, 'El título no puede tener más de 200 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
        minlength: [20, 'La descripción debe tener al menos 20 caracteres'],
        maxlength: [2000, 'La descripción no puede tener más de 2000 caracteres']
    },
    type: {
        type: String,
        required: [true, 'El tipo de incidente es obligatorio'],
        enum: {
            values: [
                'extorsion',
                'asalto',
                'amenaza',
                'robo',
                'secuestro_express',
                'pandillas',
                'otro'
            ],
            message: 'Tipo de incidente no válido'
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, 'La ubicación es obligatoria'],
            index: '2dsphere'
        },
        address: {
            type: String,
            trim: true
        },
        departmentId: {
            type: Number,
            required: [true, 'El departamento es obligatorio']
        },
        municipalityId: {
            type: Number,
            required: [true, 'El municipio es obligatorio']
        }
    },
    severity: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        default: 5
    },
    media: [{
        type: String,
        validate: {
            validator: function (url) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|mp4|webm)$/i.test(url);
            },
            message: 'URL de multimedia no válida'
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'under_review'],
        default: 'pending'
    },
    aiModeration: {
        coherence: {
            type: String,
            enum: ['baja', 'media', 'alta'],
            default: null
        },
        clarity: {
            type: String,
            enum: ['baja', 'media', 'alta'],
            default: null
        },
        detail: {
            type: String,
            enum: ['baja', 'Media', 'Alta'],
            default: null
        },
        credibility: {
            type: String,
            enum: ['baja', 'media', 'alta'],
            default: null
        },
        classificationCorrect: {
            type: Boolean,
            default: null
        },
        scoreGeneral: {
            type: Number,
            min: 0,
            max: 100,
            default: null
        },
        problemsDetected: [{
            type: String
        }],
        summary: {
            type: String
        },
        spam_score: {
            type: Number
        },
        flags: {
            type: [String],
            enum: ['possible_spam', 'offensive_language', 'too_vague', 'inconsistent'],
            default: []
        }
    },
    aiScoreColor: {
        type: String,
        enum: ['green', 'yellow', 'red']
    },
    ipHash: {
        type: String,
        select: false
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    reportedAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: true,
})

// reportSchema.index({ 'location.coordinates': '2dsphere' });
reportSchema.index({ type: 1, status: 1 });
// reportSchema.index({ department: 1, municipality: 1 });
reportSchema.index({ createdAt: -1 });

export default model('reports', reportSchema)