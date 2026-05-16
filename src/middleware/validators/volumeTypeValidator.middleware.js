const { body, param } = require('express-validator');

exports.createVolumeTypeSchema = [
body('vlmCode')
    .exists()
    .withMessage('Codigo del Volumen es requerido')
    .isLength({ min: 1 })
    .withMessage('Debe tener al menos 1caracteres'), 
body('vlmDescription')
    .exists()
    .withMessage('Descripcion del Volumen es requerido')
    .isLength({ min: 1 })
    .withMessage('Debe tener al menos 1 caracteres'),    
body('vlmStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])  
 ];

exports.updateVolumeTypeSchema = [
body('vlmCode')
    .exists()
    .withMessage('Codigo del Volumen es requerido')
    .isLength({ min: 1 })
    .withMessage('Debe tener al menos 1caracteres'), 
body('vlmDescription')
    .exists()
    .withMessage('Descripcion del Volumen es requerido')
    .isLength({ min: 1 })
    .withMessage('Debe tener al menos 1caracteres'),    
body('vlmStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])  
];

exports.deleteVolumeTypeSchema = [
param('vlmId')
    .exists()
    .withMessage('Id del tipo de Volumen es requerido')
];
    