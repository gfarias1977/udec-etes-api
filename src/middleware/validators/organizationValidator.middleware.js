const { body, param } = require('express-validator');

exports.createOrganizationSchema = [
    body('orgCode')
        .exists()
        .isAlpha()
        .withMessage('Codigo de la organizacion es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('orgDescription')
        .exists()
        .withMessage('Descripcion de la organizacion es requerido'),
    body('orgTaxPayerId')
        .exists()
        .withMessage('Rut de la organizacion es requerido'),        
    body('orgAddress')
        .exists()
        .withMessage('Direccion de la organizacion es requerido'), 
    body('orgDepartment')
        .exists()
        .withMessage('Comuna de la organizacion es requerido'),       
    body('orgCity')
        .exists()
        .withMessage('Ciudad de la organizacion es requerido'),                         
     body('orgStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateOrganizationSchema = [
    body('orgDescription')
        .exists()
        .withMessage('Descripcion de la organizacion es requerido'),
    body('orgTaxPayerId')
        .exists()
        .withMessage('Rut de la organizacion es requerido'),        
    body('orgAddress')
        .exists()
        .withMessage('Direccion de la organizacion es requerido'), 
    body('orgDepartment')
        .exists()
        .withMessage('Comuna de la organizacion es requerido'),       
    body('orgCity')
        .exists()
        .withMessage('Ciudad de la organizacion es requerido'),                         
     body('orgStatus')
        .exists()
        .isIn(['S', 'N']),
    ];

    exports.deleteOrganizationSchema = [
        body('orgCode')
        .exists()
        .isAlpha()
        .withMessage('Codigo de la organizacion es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    ];
    