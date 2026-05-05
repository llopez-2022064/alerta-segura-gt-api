import { Router } from "express";
import { createReportController, getDangerStatsByDepartamentController, getReportByIdController, getReportsByTypeWithPercentageController, getReportsController, getStatisticsController } from "./reports.controller.js";
import { validateLocation } from "./middlewares/validateLocation.js";
import { upload } from "./middlewares/upload.js";

const api = Router()

api.post('/', [upload.array('media'), validateLocation], createReportController)
api.get('/', getReportsController)
api.get('/by-department', getDangerStatsByDepartamentController)
api.get('/by-type', getReportsByTypeWithPercentageController)
api.get('/stats', getStatisticsController)
api.get('/:id', getReportByIdController)

export default api