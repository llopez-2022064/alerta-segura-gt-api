import { DEPARTMENTS, MUNICIPALITIES } from "../../../constants/locations.js";

export function validateLocation(req, res, next) {
    const { departmentId, municipalityId } = req.body.location

    const department = DEPARTMENTS.find(depart => depart.id == departmentId)
    if (!department) return res.status(400).send({ message: 'Departamento inválido' })

    const municipality = MUNICIPALITIES[departmentId]?.find(muni => muni.id == municipalityId)
    if (!municipality) return res.status(400).send({ message: 'Municipio  inválido' })

    next()
}