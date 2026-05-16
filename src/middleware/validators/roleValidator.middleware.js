const { body, param } = require('express-validator');

exports.createRoleSchema = [
    body('roleName')
        .exists()
        .withMessage('Nombre del rol es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('roleDescription')
        .exists()
        .withMessage('Descripcion del rol es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),        
     body('roleStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateRoleSchema = [
    body('roleName')
        .exists()
        .isAlpha()
        .withMessage('Nombre del rol es requerido, debe contener sólo caracteres alfabéticos')
        .isLength({ min: 6 })
        .withMessage('Debe tener al menos 6 caracteres'),
    body('roleDescription')
        .exists()
        .withMessage('Descripcion del rol es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),          
    body('roleStatus')
        .optional()
        .isAlpha()
        .withMessage('Deben ser sólo caracteres alfabéticos')
        .isIn( [ 'N', 'S'])
        .isLength({ min: 1, max: 1 }),
    ];

    exports.deleteRoleSchema = [
        param('roleId')
            .exists()
            .withMessage('Nombre del Rol es requerido')
            .isLength({ min: 6 })
            .withMessage('Debe tener al menos 6 caracteres'),
    ];
    