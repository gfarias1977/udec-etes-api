const { body, param } = require('express-validator');

exports.createProgramTypeSchema = [
    body('protCode')
        .exists()
        .withMessage('Codigo de la Tipo Programa es requerido')
        .isLength({ min: 2, max:2 })
        .withMessage('Debe tener al menos 2 caracteres'),    
    body('protName')
        .exists()
        .withMessage('Nombre de la Tipo Programa es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('protStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateProgramTypeSchema = [
    body('protName')
        .exists()
        .withMessage('Nombre de la Tipo Programa es requerido, debe contener sólo caracteres alfabéticos')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('protStatus')
        .optional()
        .isAlpha()
        .withMessage('Deben ser sólo caracteres alfabéticos')
        .isIn( [ 'N', 'S'])
        .isLength({ min: 1, max: 1 }),
    ];

exports.deleteProgramTypeSchema = [
    param('protCode')
        .exists()
        .withMessage('Codigo de la Tipo Programa es requerido')
        .isLength({ min: 2, max:2 })
        .withMessage('Debe tener al menos 2 caracteres'),
    ];
    