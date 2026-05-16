const { body, param } = require('express-validator');

exports.createBusinessUnitSchema = [
    body('buCode')
        .exists()
        .withMessage('Codigo de la Unidad de Negocio es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),    
    body('buName')
        .exists()
        .withMessage('Nombre de la Unidad de Negocio es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
     body('buStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateBusinessUnitSchema = [
    body('buName')
        .exists()
        .isAlpha()
        .withMessage('Nombre de la Unidad de Negocio es requerido, debe contener sólo caracteres alfabéticos')
        .isLength({ min: 6 })
        .withMessage('Debe tener al menos 6 caracteres'),
    body('buStatus')
        .optional()
        .isAlpha()
        .withMessage('Deben ser sólo caracteres alfabéticos')
        .isIn( [ 'N', 'S'])
        .isLength({ min: 1, max: 1 }),
    ];

    exports.deleteBusinessUnitSchema = [
        param('buCode')
            .exists()
            .withMessage('Nombre de la Unidad de Negocio es requerido')
            .isLength({ min: 6 })
            .withMessage('Debe tener al menos 6 caracteres'),
    ];
    