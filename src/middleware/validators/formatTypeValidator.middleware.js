const { body, param } = require('express-validator');

exports.createFormatTypeSchema = [
body('fmtFormat')
    .exists()
    .withMessage('Codigo del Formato es requerido')
    .isLength({ min: 1 })
    .withMessage('Debe tener al menos 1 caracteres'),
body('fmtFormatType')
    .exists()
    .withMessage('Nombre del tipo de Formato es requerido')
    .isLength({ min: 2 })
    .withMessage('Debe tener al menos 2 caracteres'),
body('fmtDescription')
    .exists()
    .withMessage('Descripcion del Formato es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),    
body('fmtStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])  
 ];

exports.updateFormatTypeSchema = [
body('fmtDescription')
    .exists()
    .withMessage('Descripcion del Formato es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),    
body('fmtStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])  
];

exports.deleteFormatTypeSchema = [
param('fmtId')
    .exists()
    .withMessage('Codigo del Formato Bibliografico es requerido')
];
    