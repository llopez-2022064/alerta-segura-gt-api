export const buildIncidentPrompt = ( title, description, type ) => {
    return `
            Actúa como un analista de incidentes y auditor de calidad de reportes ciudadanos.

            Tu tarea es evaluar la calidad, coherencia y credibilidad de un reporte anónimo basado únicamente en la información proporcionada. NO debes asumir hechos que no estén en el texto ni inventar contexto adicional.

            Analiza los siguientes campos:

            * Título: ${title}
            * Tipo de incidente: ${type}
            * Descripción: ${description}

            Evalúa el reporte según estos criterios:

            1. Coherencia:

            * ¿El título, tipo y descripción coinciden entre sí?
            * ¿Hay contradicciones?

            2. Claridad:

            * ¿El mensaje es comprensible?
            * ¿Hay ambigüedad o frases confusas?

            3. Nivel de detalle:

            * ¿El reporte contiene información útil (ubicación, contexto, acciones)?
            * ¿Es demasiado vago?

            4. Credibilidad:

            * ¿El contenido parece realista o tiene señales de ser falso, exagerado o spam?

            5. Riesgo de mala clasificación:

            * ¿El tipo de incidente coincide con la descripción?

            Devuelve la respuesta en formato JSON con esta estructura:

            {
                "coherence": "baja | media | alta",
                "clarity": "baja | media | alta",
                "detail": "baja | media | alta",
                "credibility": "baja | media | alta",
                "classificationCorrect": true | false,
                "scoreGeneral": 0 - 100,
                "problemsDetected": ["lista de problemas específicos"],
                "summary": "Resumen del reporte (explicación corta del reporte, brindando unicamente datos importantes)",
                "spam_score": 0-100
                "flags": "possible_spam | offensive_language | too_vague | inconsistent"
            }

            Reglas importantes:

            * Sé crítico pero justo
            * No inventes información
            * Si falta información, indícalo
            * Penaliza contradicciones y ambigüedad
            * Responde SOLO en JSON
            * Responde únicamente con un objeto JSON válido.
            * No incluyas texto antes ni después del JSON.
            * No uses comillas invertidas
    `
}