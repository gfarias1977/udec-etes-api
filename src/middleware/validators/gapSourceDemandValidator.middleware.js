const { Schema } = require('express-validator');

exports.createGapSourceDemandSchemaBased = {
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
            errorMessage: "Datos de Demanda requeridos (mínimo 1 registro)",
            options: { min: 1 },
        },
    },
    "data.*.gapd_stdc_year": {
        exists: {
            errorMessage: "Año  es requerido",
            options: { checkFalsy: false },
        },
    },
    "data.*.gapd_stdc_version": {
        exists: {
            errorMessage: "Version del estandar es requerido",
            options: { checkFalsy: false },
        },
    },
    "data.*.gapd_stdc_academic_year": {
        exists: {
            errorMessage: "Año academico es requerido",
            options: { checkFalsy: false },
        },
    },
    "data.*.gapd_stdc_academic_period": {
        exists: {
            errorMessage: "Periodo Academico es requerido",
            options: { checkFalsy: false },
        },
    },
    "data.*.gapd_stdc_org_code": {
        exists: {
            errorMessage: "Codigo de Organizzacion es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapd_stdc_camp_code": {
        exists: {
            errorMessage: "Código de Sede es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapd_stdc_scho_code": {
        exists: {
            errorMessage: "Código de la Unidad Academica es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapd_stdc_cours_code": {
        exists: {
            errorMessage: "Código de la Asignatura es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapd_stdc_wkt_code": {
        exists: {
            errorMessage: "Código de la Jornada es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapd_stdc_act_code": {
        exists: {
            errorMessage: "Código de la Actividad es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapd_stdc_students_qty": {
        exists: {
            errorMessage: "Cantidad de alumnos es requerido",
            options: { checkFalsy: false },
        },
    },
    "data.*.gapd_stdc_act_code_principal": {
        exists: {
            errorMessage: "Código de la actividad principal es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapd_stdc_course_type": {
        exists: {
            errorMessage: "Tipo de Asignatura es requerido",
            options: { checkFalsy: true },
        },
    },
    "data.*.gapd_stdc_city": {
        exists: {
            errorMessage: "Ciudad es requerida",
            options: { checkFalsy: true },
        },
    },
    
};
