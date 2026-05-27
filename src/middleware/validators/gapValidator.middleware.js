const { Schema } = require('express-validator');

exports.calculateGapSchemaBased = {
    "header.proc_purc_code": {
        in: ['body'],
        exists: {
            errorMessage: "Areas de Gestión es requerida",
            options: { checkFalsy: true },
        },
        isString: { errorMessage: "Areas de Gestión debe ser string" },
    },
    "header.proc_email_notification": {
        in: ['body'],
        exists: {
            errorMessage: "Email de notificación es requerido",
            options: { checkFalsy: true },
        },
        isEmail: { errorMessage: "Por favor ingresa mail válido" },
    },
    "header.procStock": {
        in: ['body'],
        exists: {
            errorMessage: "Proceso Stock es requerido",
            options: { checkFalsy: true },
        },
        isInt: { errorMessage: "Por favor ingresa id proceso stock valido" },
    },
    "header.procDemand": {
        in: ['body'],
        exists: {
            errorMessage: "Proceso Demanda es requerido",
            options: { checkFalsy: true },
        },
        isInt: { errorMessage: "Por favor ingresa id proceso demanda valido" },
    },
    "header.procStandard": {
        in: ['body'],
        exists: {
            errorMessage: "Proceso Estandard es requerido",
            options: { checkFalsy: true },
        },
        isInt: { errorMessage: "Por favor ingresa id proceso estandard valido" },
    },
};
