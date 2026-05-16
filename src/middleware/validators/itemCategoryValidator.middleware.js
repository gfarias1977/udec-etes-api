const { body, param } = require('express-validator');

exports.createItemCategorySchema = [
body('itmcPurcCode')
    .exists()
    .withMessage('Codigo del Area de Compra es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('itmcName')
    .exists()
    .withMessage('Nombre de la Categoria es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('itmcDescription')
    .exists()
    .withMessage('Descipcion de la Categoria es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),        
body('itmcOrder')
    .exists()
    .isNumeric()
    .withMessage('Orden de la Categoria es requerido'),
body('itmcParentCode')
    .exists()
    .isNumeric()
    .withMessage('Codigo Padre de la Categoria es requerido'),    
body('itmcStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
 ];

exports.updateItemCategorySchema = [
body('itmcPurcCode')
    .exists()
    .withMessage('Codigo del Area de Compra es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),    
body('itmcName')
    .exists()
    .withMessage('Nombre de la Categoria es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('itmcDescription')
    .exists()
    .withMessage('Descipcion de la Categoria es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),        
body('itmcOrder')
    .exists()
    .isNumeric()
    .withMessage('Orden de la Categoria es requerido'),
body('itmcParentCode')
    .exists()
    .isNumeric()
    .withMessage('Codigo Padre de la Categoria es requerido'),    
body('itmcStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    ];

exports.deleteItemCategorySchema = [
param('itmcCode')
    .exists()
    .withMessage('Codigo del la Categoria es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
param('itmcPurcCode')
    .exists()
    .withMessage('Codigo del Area de Compra es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres')
];
    