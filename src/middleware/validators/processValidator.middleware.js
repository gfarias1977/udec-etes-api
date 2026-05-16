const { body, param } = require('express-validator');

exports.createProcessSchema = [
    body('procPurcCode')
        .exists()
        .withMessage('Codigo de la Area de Gestión')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('procProctId')
        .exists()
        .withMessage('Codigo del Tipo de Proceso es requerido'),        
    body('procScheduledDate')
        .exists()
        .withMessage('Fecha del proceso es requerido'),
    body('[procEmailNotification]')
        .exists()
        .withMessage('Email para la Notificación es requerido'),  
    body('procCode')
        .exists()
        .withMessage('Codigo de Automático del Proceso es requerido'),                            
    body('procFile')
        .exists()
        .withMessage('Descripcion del Archivo Original la Proceso es requerido'),
    body('procFileUploaded')
        .exists()
        .withMessage('Descripcion del Archivo Cargado a la Proceso es requerido'),  
    body('procStatus')
        .exists()
        .isIn(['P', 'F', 'E']),
];

exports.updateProcessSchema = [
    body('procPurcCode')
        .exists()
        .withMessage('Codigo de la Area de Gestión')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('procProctId')
        .exists()
        .withMessage('Codigo del Tipo de Proceso es requerido'),        
    body('procScheduledDate')
        .exists()
        .withMessage('Fecha del proceso es requerido'),
    body('[procEmailNotification]')
        .exists()
        .withMessage('Email para la Notificación es requerido'),  
    body('procCode')
        .exists()
        .withMessage('Codigo de Automático del Proceso es requerido'),                            
    body('procFile')
        .exists()
        .withMessage('Descripcion del Archivo Original la Proceso es requerido'),
    body('procFileUploaded')
        .exists()
        .withMessage('Descripcion del Archivo Cargado a la Proceso es requerido'),  
    body('procStatus')
        .exists()
        .isIn(['P', 'F', 'E']),
];

    exports.deleteProcessSchema = [
    body('procId')
        .exists()
        .isAlpha()
        .withMessage('Id del Proceso es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    ];
    