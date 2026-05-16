const { body, param } = require('express-validator');

exports.createApplicationSchema = [
body('appCode')
    .exists()
    .isAlpha()
    .withMessage('Codigo de la Aplicacion es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 6 })
    .withMessage('Debe tener al menos 6 caracteres'),    
body('appDescription')
    .exists()
    .isAlpha()
    .withMessage('Descripcion de la Aplicacion es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 6 })
    .withMessage('Debe tener al menos 6 caracteres'),
body('appParentId')
    .exists()
    .isNumeric()
    .withMessage('Aplicacion Padre es requerido, debe contener sólo numeros'),
body('appMenuDisplay')
    .exists()
    .withMessage('Despliegue de menu de la Aplicacion es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('appUrl')
    .exists()
    .withMessage('Url de la Aplicacion es requerido')
    .isLength({ min: 6 })
    .withMessage('Debe tener al menos 6 caracteres'), 
body('appOrder')
    .exists()
    .isNumeric()
    .withMessage('Orden es requerido, debe contener sólo numeros'),    
body('appComponent')
    .exists()
    .withMessage('Tipo de componente de la Aplicacion es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),            
body('appAlt')
    .exists()
    .withMessage('Descripcion ALT la Aplicacion es requerido')
    .isLength({ min: 6 })
    .withMessage('Debe tener al menos 6 caracteres'),                     
body('appStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    .isLength({ min: 1, max: 1 }),
];

exports.updateApplicationSchema = [
    body('appDescription')
        .exists()
        .isAlpha()
        .withMessage('Descripcion de la Aplicacion es requerido, debe contener sólo caracteres alfabéticos')
        .isLength({ min: 6 })
        .withMessage('Debe tener al menos 6 caracteres'),
    body('appParentId')
        .exists()
        .isNumeric()
        .withMessage('Aplicacion Padre es requerido, debe contener sólo numeros'),
    body('appMenuDisplay')
        .exists()
        .withMessage('Despliegue de menu de la Aplicacion es requerido')
        .isLength({ min: 4})
        .withMessage('Debe tener al menos 4 caracteres'),
    body('appUrl')
        .exists()
        .withMessage('Url de la Aplicacion es requerido')
        .isLength({ min: 6 })
        .withMessage('Debe tener al menos 6 caracteres'), 
    body('appOrder')
        .exists()
        .isNumeric()
        .withMessage('Orden es requerido, debe contener sólo numeros'),    
    body('appComponent')
        .exists()
        .withMessage('Tipo de componente de la Aplicacion es requerido')
        .isLength({ min: 4 })
        .withMessage('Debe tener al menos 4 caracteres'),            
    body('appAlt')
        .exists()
        .withMessage('Descripcion ALT la Aplicacion es requerido')
        .isLength({ min: 6 })
        .withMessage('Debe tener al menos 6 caracteres'),                     
    body('appStatus')
        .optional()
        .isAlpha()
        .withMessage('Deben ser sólo caracteres alfabéticos')
        .isIn( [ 'N', 'S'])
        .isLength({ min: 1, max: 1 }),
    ];


    exports.deleteApplicationSchema = [
        param('appId')
            .exists()
            .withMessage('Nombre del Rol es requerido')
            .isLength({ min: 6 })
            .withMessage('Debe tener al menos 6 caracteres'),
    ];
    