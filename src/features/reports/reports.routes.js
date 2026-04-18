import { Router } from "express";
import { createReportController, getDangerStatsByDepartamentController, getReportsByTypeWithPercentageController, getReportsController } from "./reports.controller.js";
import { validateLocation } from "./middlewares/validateLocation.js";

const api = Router()

api.post('/', [validateLocation], createReportController)
api.get('/', getReportsController)
api.get('/by-department', getDangerStatsByDepartamentController)
api.get('/by-type', getReportsByTypeWithPercentageController)

export default api