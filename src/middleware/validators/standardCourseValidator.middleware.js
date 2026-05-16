const { body, param } = require('express-validator');

exports.createStandardCourseSchema = [
    body('stdcStdCode')
        .exists()
        .withMessage('Codigo del estandar es requerido'), 
    body('stdcOrgCode')
        .exists()
        .withMessage('Codigo de la organizacion de costo es requerido'),     
    body('stdcBuCode')
        .exists()
        .withMessage('Codigo de la unidad de negocio es requerido'),                
    body('stdcPurcCode')
        .exists()
        .withMessage('Codigo del area de compra es requerido'),   
    body('stdcStdVersion')
        .exists()
        .isNumeric()
        .withMessage('Version del estandar es requerido'),                 
    body('stdcCoursCode')
        .exists()
        .withMessage('Codigo del Recinto Prototipo es requerido'),
    body('stdcRlayCode]')
        .exists()
        .withMessage('Codigo Centro de costo es requerido'),          
    body('stdcSchoCode')
        .exists()
        .withMessage('Codigo Unidad academica es requerido'),        
    body('stdcItemCode')
        .exists()
        .withMessage('Codigo del Articulo es requerido'),        
    body('stdcPerformance')
        .exists()
        .withMessage('Rendimiento es requerido'),  
    body('stdcRenewalCicle')
        .exists()
        .isDecimal()
        .withMessage('Ciclo de Renovacion es requerido'),  
    body('stdcMaintenanceCicle')
        .exists()
        .isDecimal()
        .withMessage('Ciclo Mantencion es requerido'),  
    body('stdcDetail')
        .exists()
        .withMessage('Especificacion Tecnica es requerido'),                          
    body('stdcStatus')
        .exists()
        .isIn(['S', 'N'])
    ];

exports.updateStandardCourseSchema = [
    body('stdcPerformance')
        .exists()
        .withMessage('Rendimiento es requerido'),  
    body('stdcRenewalCicle')
        .exists()
        .isDecimal()
        .withMessage('Ciclo de Renovacion es requerido'),  
    body('stdcMaintenanceCicle')
        .exists()
        .isDecimal()
        .withMessage('Ciclo Mantencion es requerido'),  
    body('stdcDetail')
        .exists()
        .withMessage('Especificacion Tecnica es requerido'),                          
    body('stdcStatus')
        .exists()
        .isIn(['S', 'N'])
    ];

exports.deleteStandardCourseSchema = [
    param('stdcStdCode')
        .exists()
        .withMessage('Codigo del estandar es requerido'), 
    param('stdcOrgCode')
        .exists()
        .withMessage('Codigo de la organizacion de costo es requerido'),     
    param('stdcBuCode')
        .exists()
        .withMessage('Codigo de la unidad de negocio es requerido'),                
    param('stdcPurcCode')
        .exists()
        .withMessage('Codigo del area de compra es requerido'),   
    param('stdcVersion')
        .exists()
        .isNumeric()
        .withMessage('Version del estandar es requerido'),                 
    param('stdcCoursCode')
        .exists()
        .withMessage('Codigo del Recinto Prototipo es requerido'),
    param('stdcRlayCode')
        .exists()
        .withMessage('Codigo Centro de costo es requerido'),          
    param('stdcSchoCode')
        .exists()
        .withMessage('Codigo Unidad academica es requerido'),        
    param('stdcItemCode')
        .exists()
        .withMessage('Codigo del Articulo es requerido')       
    ];
    
    exports.deleteStandardCourseRlayCourseSchema = [
        param('stdcStdCode')
            .exists()
            .withMessage('Codigo del estandar es requerido'),
        param('stdcOrgCode')
            .exists()
            .withMessage('Codigo de la organizacion de costo es requerido'),
        param('stdcBuCode')
            .exists()
            .withMessage('Codigo de la unidad de negocio es requerido'),
        param('stdcPurcCode')
            .exists()
            .withMessage('Codigo del area de compra es requerido'),
        param('stdcVersion')
            .exists()
            .isNumeric()
            .withMessage('Version del estandar es requerido'),
        param('stdcCoursCode')
            .exists()
            .withMessage('Codigo del Recinto Prototipo es requerido'),
        param('stdcRlayCode')
            .exists()
            .withMessage('Codigo Centro de costo es requerido'),
        param('stdcItemCode')
            .exists()
            .withMessage('Codigo del Articulo es requerido')
    ];