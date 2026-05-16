exports.createGapSourceStandardSchemaBased = {
    "header.proc_purc_code": {
        exists: {
            errorMessage: "Areas de Gestión es requerida",
            options: { checkFalsy: true },
        },
        isString: { errorMessage: "Areas de Gestión debe ser string" },
    },
    "header.proc_email_notification": {
        exists: {
            errorMessage: "Email de notificación es requerido",
            options: { checkFalsy: true },
        },
        isEmail: { errorMessage: "Por favor ingresa mail válido" },
    }

};
