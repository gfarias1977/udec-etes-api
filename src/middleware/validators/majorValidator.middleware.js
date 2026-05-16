const { body, param } = require('express-validator');

exports.createMajorSchema = [
    body('majorCode')
        .exists()
        .withMessage('Codigo de la Carrera es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('majorOrgCode')
        .exists()
        .withMessage('Codigo de la Organizacion es requerido'),        
    body('majorSchoolCode')
        .exists()
        .withMessage('Codigo de la Unidad Academica es requerido'),
    body('majorCaccCode')
        .exists()
        .withMessage('Codigo del Centro de Costo es requerido'),  
    body('majorLevelCode')
        .exists()
        .withMessage('Codigo de Nivel o Grado Academico es requerido'),                            
    body('majorDescription')
        .exists()
        .withMessage('Descripcion de la Carrera es requerido'),
  
    body('majorStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateMajorSchema = [
    body('majorOrgCode')
        .exists()
        .withMessage('Codigo de la Organizacion es requerido'),        
    body('majorSchoolCode')
        .exists()
        .withMessage('Codigo de la Unidad Academica es requerido'),
    body('majorCaccCode')
        .exists()
        .withMessage('Codigo del Centro de Costo es requerido'),  
    body('majorLevelCode')
        .exists()
        .withMessage('Codigo de Nivel o Grado Academico es requerido'),                            
    body('majorDescription')
        .exists()
        .withMessage('Descripcion de la Carrera es requerido'),
    body('majorStatus')
        .exists()
        .isIn(['S', 'N']),
    ];

    exports.deleteMajorSchema = [
    body('majorCode')
        .exists()
        .isAlpha()
        .withMessage('Codigo de la Carrera es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    ];
    