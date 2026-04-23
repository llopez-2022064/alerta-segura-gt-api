import { DEPARTMENTS, MUNICIPALITIES } from "../../../constants/locations.js";

export function validateLocation(req, res, next) {
    if (typeof req.body.location === "string") {
        try {
            req.body.location = JSON.parse(req.body.location);
        } catch (e) {
            return res.status(400).send({ message: "El campo location no es un JSON válido" });
        }
    }

    if (!req.body.location) {
        return res.status(400).send({ message: "El campo location es requerido" });
    }

    const { departmentId, municipalityId } = req.body.location;

    const department = DEPARTMENTS.find(depart => depart.id == departmentId);
    if (!department) return res.status(400).send({ message: "Departamento inválido" });

    const municipality = MUNICIPALITIES[departmentId]?.find(muni => muni.id == municipalityId);
    if (!municipality) return res.status(400).send({ message: "Municipio inválido" });

    next();
}