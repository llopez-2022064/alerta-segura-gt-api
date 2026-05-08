import { config } from "dotenv";
config()

import { connectDB } from "./database.js";

import cors from 'cors'
import express from 'express'
import helmet from 'helmet';
import morgan from 'morgan';

import routesReport from '../features/reports/reports.routes.js'
import { handleMulterError } from "../features/reports/middlewares/handleMulterError.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
    origin: [
        'https://alerta-segura.netlify.app',
        'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.set('trust proxy', 1)

app.use(handleMulterError)

app.use('/api/v1/reports', routesReport)

export const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}