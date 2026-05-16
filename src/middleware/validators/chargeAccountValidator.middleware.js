const { body, param } = require('express-validator');

exports.createChargeAccountSchema = [
body('caccCode')
    .exists()
    .withMessage('Codigo del Centro de Costo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),   
body('caccOrgCode')
    .exists()
    .isAlpha()
    .withMessage('Codigo de la Organizacion es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('caccDescription')
    .exists()
    .withMessage('Descripcion del Centro de Costo es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('caccStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    .isLength({ min: 1, max: 1 }),  
];

exports.updateChargeAccountSchema = [
body('caccDescription')
    .exists()
    .withMessage('Descripcion del Centro de Costo es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('caccStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    .isLength({ min: 1, max: 1 }),  
    ];


exports.deleteChargeAccountSchema = [
        param('caccCode')
            .exists()
            .withMessage('Codigo del Centro de Costo es requerido')
            .isLength({ min: 4 })
            .withMessage('Debe tener al menos 6 caracteres'),
        param('caccOrgCode')
            .exists()
            .isAlpha()
            .withMessage('Codigo de la Organizacion es requerido, debe contener sólo caracteres alfabéticos')
            .isLength({ min: 4 })
            .withMessage('Debe tener al menos 4 caracteres'),            
    ];
    