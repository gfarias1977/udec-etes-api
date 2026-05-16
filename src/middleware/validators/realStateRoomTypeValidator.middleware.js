const { body, param } = require('express-validator');

exports.createRealStateRoomTypeSchema = [
    body('rsrtCode')
        .exists()
        .withMessage('Codigo de la Recinto Tipo es requerido')
        .isLength({ min: 2, max:2 })
        .withMessage('Debe tener al menos 2 caracteres'),    
    body('rsrtDescription')
        .exists()
        .withMessage('Nombre de la Recinto Tipo es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('rsrtStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateRealStateRoomTypeSchema = [
    body('rsrtDescription')
        .exists()
        .withMessage('Nombre de la Recinto Tipo es requerido, debe contener sólo caracteres alfabéticos')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('rsrtStatus')
        .optional()
        .isAlpha()
        .withMessage('Deben ser sólo caracteres alfabéticos')
        .isIn( [ 'N', 'S'])
        .isLength({ min: 1, max: 1 }),
    ];

exports.deleteRealStateRoomTypeSchema = [
    param('rsrtCode')
        .exists()
        .withMessage('Codigo de la Recinto Tipo es requerido')
        .isLength({ min: 2, max:2 })
        .withMessage('Debe tener al menos 2 caracteres'),
    ];
    