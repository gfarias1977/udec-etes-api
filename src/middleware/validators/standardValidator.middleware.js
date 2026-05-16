const { body, param } = require('express-validator');

exports.createStandardSchema = [
    body('stdCode')
        .exists()
        .withMessage('Codigo del estandar es requerido'), 
    body('stdOrgCode')
        .exists()
        .withMessage('Codigo de la organizacion de costo es requerido'),     
    body('stdBuCode')
        .exists()
        .withMessage('Codigo de la unidad de negocio es requerido'),                
    body('stdPurcCode')
        .exists()
        .withMessage('Codigo del area de compra es requerido'),   
    body('stdVersion')
        .exists()
        .isNumeric()
        .withMessage('Version del estandar es requerido'),                 
    body('stdName')
        .exists()
        .withMessage('Nombre del estandar es requerido'),
    body('stdCaccCode]')
        .exists()
        .withMessage('Centro de costo del estandar es requerido'),          
    body('stdSchoCode')
        .exists()
        .withMessage('Unidad academica del estandard es requerido'),        
    body('stdYear')
        .exists()
        .isNumeric()
        .withMessage('AñO del estandard es requerido'),        
    body('stdStatus')
        .exists()
        .isIn(['S', 'N'])
       
];

exports.updateStandardSchema = [
    body('stdOrgCode')
        .exists()
        .withMessage('Codigo de la organizacion de costo es requerido'),   
    body('stdCaccCode')
        .exists()
        .withMessage('Centro de costo del estandard es requerido'),  
    body('stdSchoCode')
        .exists()
        .withMessage('Unidad academica del estandard es requerido'),                  
    body('stdName')
        .exists()
        .withMessage('Nombre del estandar es requerido'),
    body('stdYear')
        .exists()
        .isNumeric()
        .withMessage('AñO del estandard es requerido'),        
    body('stdStatus')
        .exists()
        .isIn(['S', 'N'])
    ];

    exports.deleteStandardSchema = [
        param('stdCode')
            .exists()
            .withMessage('Codigo del estandar es requerido'),
        param('stdOrgCode')
            .exists()
            .withMessage('Codigo de la organizacion es requerido'),
        param('stdBuCode')
            .exists()
            .withMessage('Codigo de la Unidad de negocio es requerido'),
        param('stdPurcCode')
            .exists()
            .withMessage('Codigo del centro de costo es requerido'),
        param('stdVersion')
            .exists()
            .withMessage('Version del estandar es requerido')         
    ];

    exports.enableDisableStandardSchema = [
        param('stdCode')
            .exists()
            .withMessage('Codigo del estandar es requerido'),
        param('stdOrgCode')
            .exists()
            .withMessage('Codigo de la organizacion es requerido'),
        param('stdBuCode')
            .exists()
            .withMessage('Codigo de la Unidad de negocio es requerido'),
        param('stdPurcCode')
            .exists()
            .withMessage('Codigo del centro de costo es requerido'),
        param('stdVersion')
            .exists()
            .withMessage('Version del estandar es requerido')         
    ];
    
