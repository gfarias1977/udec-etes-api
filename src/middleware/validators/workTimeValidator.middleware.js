const { body, param } = require('express-validator');

exports.createWorkTimeSchema = [
body('wktCode')
    .exists()
    .withMessage('Codigo de la Jornada es requerido')
    .isLength({ min: 1, max:2 })
    .withMessage('Debe tener al menos 3 caracteres'),  
body('wktName')
    .exists()
    .withMessage('Nombre de la Jornada es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),      
body('wktStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
 ];

exports.updateWorkTimeSchema = [
body('wktName')
    .exists()
    .withMessage('Nombre de la Jornada es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),      
body('wktStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S']) 
    ];

exports.deleteWorkTimeSchema = [
param('wktCode')
    .exists()
    .withMessage('Codigo de la Jornada es requerido')
    .isLength({ min: 1, max:2 })
    .withMessage('Debe tener al menos 6 caracteres'),
];
    