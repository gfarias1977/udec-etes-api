const { body, param } = require('express-validator');

exports.createItemAttributeSchema = [
body('itmaCode')
    .exists()
    .withMessage('Codigo del Atributo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),    
body('itmaPurcCode')
    .exists()
    .withMessage('Codigo del Area de Compra es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('itmaOrder')
    .exists()
    .isNumeric()
    .withMessage('Orden del Atributo es requerido'),
body('itmaStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
 ];

exports.updateItemAttributeSchema = [
body('itmaOrder')
    .exists()
    .isNumeric()
    .withMessage('Orden del Atributo es requerido'),
body('itmaStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    ];

exports.deleteItemAttributeSchema = [
param('itmaCode')
    .exists()
    .withMessage('Codigo del Atributo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
param('itmaPurcCode')
    .exists()
    .withMessage('Codigo del Area de Compra es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres')
];
    