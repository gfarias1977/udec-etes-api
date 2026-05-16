const { body, param } = require('express-validator');

exports.createActivitySchema = [
    body('actCode')
        .exists()
        .withMessage('Codigo de la Actividad es requerido')
        .isLength({ min: 3, max:3 })
        .withMessage('Debe tener al menos 3 caracteres'),    
    body('actName')
        .exists()
        .withMessage('Nombre de la Actividad es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
     body('actStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateActivitySchema = [
    body('actName')
        .exists()
        .isAlpha()
        .withMessage('Nombre de la Actividad es requerido, debe contener sólo caracteres alfabéticos')
        .isLength({ min: 6 })
        .withMessage('Debe tener al menos 6 caracteres'),
    body('actStatus')
        .optional()
        .isAlpha()
        .withMessage('Deben ser sólo caracteres alfabéticos')
        .isIn( [ 'N', 'S'])
        .isLength({ min: 1, max: 1 }),
    ];

    exports.deleteActivitySchema = [
        param('actCode')
            .exists()
            .withMessage('Nombre de la Actividad es requerido')
            .isLength({ min: 6 })
            .withMessage('Debe tener al menos 6 caracteres'),
    ];
    