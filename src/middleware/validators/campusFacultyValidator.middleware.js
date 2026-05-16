const { body, param } = require('express-validator');

exports.createCampusFacultySchema = [
body('cfacFacuCode')
    .exists()
    .withMessage('Codigo del Facultad es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),   
body('cfacCampCode')
    .exists()
    .withMessage('Codigo de la sede es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3caracteres'),
body('cfacOrgCode')
    .exists()
    .withMessage('Descripcion del Organizacion es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('cfacStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    .isLength({ min: 1, max: 1 }),  
];

exports.updateCampusFacultySchema = [
body('cfacStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    .isLength({ min: 1, max: 1 }),  
    ];


exports.deleteCampusFacultySchema = [
param('cfacFacuCode')
    .exists()
    .withMessage('Codigo del Facultad es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
param('cfacCampCode')
    .exists()
    .withMessage('Codigo del Sede es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
param('cfacOrgCode')
    .exists()
    .withMessage('Codigo del Organizacion es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),                        
    ];
    