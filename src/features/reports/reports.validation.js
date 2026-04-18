import Joi from "joi";

const createReportSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(200)
        .trim()
        .required()
        .messages({
            'string.empty': 'El título es obligatorio',
            'string.min': 'El título debe tener al menos 5 caracteres',
            'string.max': 'El título no puede tener más de 200 caracteres'
        }),
    description: Joi.string()
        .min(20)
        .max(2000)
        .trim()
        .required()
        .messages({
            'string.empty': 'La descripción es obligatoria',
            'string.min': 'La descripción debe tener al menos 20 caracteres'
        }),
    type: Joi.string()
        .valid(
            'extorsion',
            'asalto',
            'amenaza',
            'robo',
            'secuestro_express',
            'violencia',
            'pandillas',
            'otro'
        )
        .required()
        .messages({
            'any.only': 'Tipo de incidente no válido'
        }),
    location: Joi.object({
        coordinates: Joi.array()
            .items(Joi.number().required())
            .length(2)
            .required(),
        address: Joi.string().trim().allow(''),
        departmentId: Joi.number().required(),
        municipalityId: Joi.number().required()
    }).required(),
    severity: Joi.number()
        .integer()
        .min(1)
        .max(10)
        .default(5),

    media: Joi.array()
        .items(Joi.string().uri().pattern(/\.(jpg|jpeg|png|mp4|webm)$/i))
        .max(5)
        .default([])
})

export const validateCreateReport = (data) => {
    return createReportSchema.validate(data, {
        abortEarly: false, // Devuelve todos los errores
        stripUnknown: true // Elimina campos desconocidos
    })
}