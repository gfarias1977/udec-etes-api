const { body, param } = require('express-validator');

exports.createLevelSchema = [
body('levelCode')
    .exists()
    .withMessage('Codigo del Grado o Nivel Academico es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),  
body('levelDescription')
    .exists()
    .withMessage('Nombre del Grado o Nivel Academico es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),      
body('levelStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
 ];

exports.updateLevelSchema = [
body('levelDescription')
    .exists()
    .withMessage('Nombre del Grado o Nivel Academico es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),      
body('levelStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S']) 
    ];

exports.deleteLevelSchema = [
param('levelCode')
    .exists()
    .withMessage('Codigo del Grado o Nivel Academico es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 6 caracteres'),
];
    