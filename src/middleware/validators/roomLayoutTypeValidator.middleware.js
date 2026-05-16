const { body, param } = require('express-validator');

exports.createRoomLayoutTypeSchema = [
body('rlatCode')
    .exists()
    .withMessage('Codigo del Recinto Tipo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),  
body('rlatDescription')
    .exists()
    .withMessage('Nombre del Recinto Tipo es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),      
body('rlatStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
 ];

exports.updateRoomLayoutTypeSchema = [
body('rlatDescription')
    .exists()
    .withMessage('Nombre del Recinto Tipo es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),      
body('rlatStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S']) 
    ];

exports.deleteRoomLayoutTypeSchema = [
param('rlatCode')
    .exists()
    .withMessage('Codigo del Recinto Tipo es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 6 caracteres'),
];
    