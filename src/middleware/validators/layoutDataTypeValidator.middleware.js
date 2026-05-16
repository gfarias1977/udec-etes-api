const { body, param } = require('express-validator');

exports.createLayoutDataTypeSchema = [
body('laydCode')
    .exists()
    .withMessage('Codigo del Tipo de Layout es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),  
body('laydName')
    .exists()
    .withMessage('Nombre del Tipo de Layout es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),      
body('laydDocumentType')
    .exists()
    .withMessage('Tipo de documento es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('laydStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
 ];

exports.updateLayoutDataTypeSchema = [
body('laydName')
    .exists()
    .withMessage('Nombre del Tipo de Layout es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),      
body('laydDocumentType')
    .exists()
    .withMessage('Tipo de Documento es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('laydStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S']) 
    ];

exports.deleteLayoutDataTypeSchema = [
param('laydCode')
    .exists()
    .withMessage('Codigo del Tipo de Layout es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 6 caracteres'),
];
    