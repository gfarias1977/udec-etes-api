const { body, param } = require('express-validator');

exports.createProgramSchema = [
    body('progCode')
        .exists()
        .withMessage('Codigo del Plan es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('progMajorCode')
        .exists()
        .withMessage('Descripcion de la Carrera es requerido'),
    body('progProtCode')
        .exists()
        .withMessage('Tipo de Plan es requerido'),        
    body('progPropCode')
        .exists()
        .withMessage('Periodo del PLan es requerido'), 
    body('progYear')
        .exists()
        .withMessage('Año es requerido'),    
    body('progMajorName')
        .exists()
        .withMessage('Nombre de la Carrera es requerido'),    
    body('progTitle')
        .exists()
        .withMessage('Titulo es requerido'),    
    body('progDegre')
        .exists()
        .withMessage('Grado es requerido'),    
    body('progBachelor')
        .exists()
        .withMessage('Bachiller es requerido'),                                               
    body('progLevel')
        .exists()
        .withMessage('Nivel es requerido'),            
    body('progStatus')
        .exists()
        .isIn(['S', 'N']),

];

exports.updateProgramSchema = [
    body('progProtCode')
        .exists()
        .withMessage('Tipo de Plan es requerido'),        
    body('progPropCode')
        .exists()
        .withMessage('Periodo del PLan es requerido'), 
    body('progYear')
        .exists()
        .withMessage('Año es requerido'),    
    body('progMajorName')
        .exists()
        .withMessage('Nombre de la Carrera es requerido'),    
    body('progTitle')
        .exists()
        .withMessage('Titulo es requerido'),    
    body('progDegre')
        .exists()
        .withMessage('Grado es requerido'),    
    body('progBachelor')
        .exists()
        .withMessage('Bachiller es requerido'),                                               
    body('progLevel')
        .exists()
        .withMessage('Nivel es requerido'),            
    body('progStatus')
        .exists()
        .isIn(['S', 'N']),
    ];

    exports.deleteProgramSchema = [
    param('progCode')
        .exists()
        .withMessage('Codigo del Plan es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    param('progMajorCode')
        .exists()
        .withMessage('Descripcion de la Carrera es requerido'),
    ];
    