const { Schema } = require('express-validator');

exports.calculateGapSchemaBased = {
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
    },
    "header.procStock": {
        exists: {
            errorMessage: "Proceso Stock es requerido",
            options: { checkFalsy: true },
        },
        isString: { errorMessage: "Por favor ingresa id proceso stock valido" },
    },
    "header.procDemand": {
        exists: {
            errorMessage: "Proceso Demanda es requerido",
            options: { checkFalsy: true },
        },
        isString: { errorMessage: "Por favor ingresa id proceso demanda valido" },
    },
    "header.procStandard": {
        exists: {
            errorMessage: "Proceso Estandard es requerido",
            options: { checkFalsy: true },
        },
        isString: { errorMessage: "Por favor ingresa id proceso estandard valido" },
    },        
   
    
};
