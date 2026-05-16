const { body, param } = require('express-validator');

exports.createFacultySchema = [
body('facuCode')
    .exists()
    .withMessage('Codigo de la Facultad es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),    
body('facuOrgCode')
    .exists()
    .withMessage('Codigo de la Organizacion es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('facuName')
    .exists()
    .withMessage('Nombre de la Facultad es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('facuStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
 ];

exports.updateFacultySchema = [
    body('facuOrgCode')
    .exists()
    .withMessage('Codigo de la Organizacion es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('facuName')
    .exists()
    .withMessage('Nombre de la Facultad es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('facuStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])  
    ];

exports.deleteFacultySchema = [
param('facuCode')
    .exists()
    .withMessage('Codigo del Facultad es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 6 caracteres'),
];
    