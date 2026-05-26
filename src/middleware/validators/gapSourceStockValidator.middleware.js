const { Schema } = require('express-validator');

exports.createGapSourceStockSchemaBased = {
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
        isString: { errorMessage: "Email de notificación debe ser string" },
        custom: {
            options: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return String(value).split(';').map(e => e.trim()).filter(e => e.length > 0).every(e => emailRegex.test(e));
            },
            errorMessage: "Por favor ingresa mail(s) válido(s) separados por ;",
        },
    },
    data: {
        isArray: {
            bail: true,
            errorMessage: "Datos de Stock requeridos (mínimo 1 registro)",
            options: {
              min: 1,
            },
        },
    },    
    "data.*.gapst_org_code": {
        exists: {
            errorMessage: "Código de la Organización es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_camp_code": {
        exists: {
            errorMessage: "Código de la Sede es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_camp_library": {
        exists: {
            errorMessage: "Código de la Biblioteca es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_camp_sub_library": {
        exists: {
            errorMessage: "Código de la Sub Biblioteca es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_city": {
        exists: {
            errorMessage: "Código de la Ciudad es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_item_code": {
        exists: {
            errorMessage: "Código del Item es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_library_id": {
        exists: {
            errorMessage: "Id de la Biblioteca es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_item_id": {
        exists: {
            errorMessage: "Id del Item es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_format": {
        exists: {
            errorMessage: "Formato es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_format_type": {
        exists: {
            errorMessage: "Tipo de Formato es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapst_volumen": {
        exists: {
            errorMessage: "Volumen es requerido",
            options: { checkFalsy: true },
        },
    },

};
