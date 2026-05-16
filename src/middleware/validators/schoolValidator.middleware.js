const { body, param } = require('express-validator');

exports.createSchoolSchema = [
    body('schoCode')
        .exists()
        .withMessage('Codigo de la Unidad Academica es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('schoOrgCode')
        .exists()
        .withMessage('Descripcion de la Organizacion es requerido'),
    body('schoCaccCode')
        .exists()
        .withMessage('Rut de la Centro de Costo es requerido'),        
    body('schoBuCode')
        .exists()
        .withMessage('Direccion de la Unidad de Negocio es requerido'), 
    body('schoDescription')
        .exists()
        .withMessage('Comuna de la Unidad Academica es requerido'),       
    body('schoStatus')
        .exists()
        .isIn(['S', 'N']),

];

exports.updateSchoolSchema = [ 
    body('schoCaccCode')
        .exists()
        .withMessage('Centro de Costo es requerido'),        
    body('schoBuCode')
        .exists()
        .withMessage('Unidad de Negocio es requerido'), 
    body('schoDescription')
        .exists()
        .withMessage('Descripcion de la Unidad Academica es requerido'),       
    body('schoStatus')
        .exists()
        .isIn(['S', 'N']),
    ];

    exports.deleteSchoolSchema = [
    param('schoCode')
        .exists()
        .isAlpha()
        .withMessage('Codigo de la Unidad Academica es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    ];
    