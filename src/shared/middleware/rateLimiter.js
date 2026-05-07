import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    // Máximo 3 requests cada 5 minutos
    windowMs: 5 * 60 * 1000,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
})