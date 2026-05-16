const { body, param } = require('express-validator');

exports.createPurchaseAreaSchema = [
    body('purcCode')
        .exists()
        .isAlpha()
        .withMessage('Codigo del Area de Compra es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 6 caracteres'),    
    body('purcName')
        .exists()
        .isAlpha()
        .withMessage('Nombre del Area de Compra es requerido')
        .isLength({ min: 10 })
        .withMessage('Debe tener al menos 10 caracteres'),
     body('purcStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updatePurchaseAreaSchema = [
    body('purcName')
        .exists()
        .isAlpha()
        .withMessage('Nombre del Area de Compra es requerido, debe contener sólo caracteres alfabéticos')
        .isLength({ min: 6 })
        .withMessage('Debe tener al menos 6 caracteres'),
   body('purcStatus')
        .optional()
        .isAlpha()
        .withMessage('Deben ser sólo caracteres alfabéticos')
        .isIn( [ 'N', 'S'])
        .isLength({ min: 1, max: 1 }),
    ];

    exports.deletePurchaseAreaSchema = [
        param('purcCode')
            .exists()
            .isAlpha()
            .withMessage('Nombre del Area de Compra es requerido')
            .isLength({ min: 6 })
            .withMessage('Debe tener al menos 6 caracteres'),
    ];
    