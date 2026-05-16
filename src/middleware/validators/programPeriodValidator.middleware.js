const { body, param } = require('express-validator');

exports.createProgramPeriodSchema = [
    body('propCode')
        .exists()
        .withMessage('Codigo del Periodo Programa es requerido')
        .isLength({ min: 2, max:2 })
        .withMessage('Debe tener al menos 2 caracteres'),    
    body('propName')
        .exists()
        .withMessage('Nombre del Periodo Programa es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('propStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateProgramPeriodSchema = [
    body('propName')
        .exists()
        .withMessage('Nombre del Periodo Programa es requerido, debe contener sólo caracteres alfabéticos')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('propStatus')
        .optional()
        .isAlpha()
        .withMessage('Deben ser sólo caracteres alfabéticos')
        .isIn( [ 'N', 'S'])
        .isLength({ min: 1, max: 1 }),
    ];

exports.deleteProgramPeriodSchema = [
    param('propCode')
        .exists()
        .withMessage('Codigo del Periodo Programa es requerido')
        .isLength({ min: 2, max:2 })
        .withMessage('Debe tener al menos 2 caracteres'),
    ];
    