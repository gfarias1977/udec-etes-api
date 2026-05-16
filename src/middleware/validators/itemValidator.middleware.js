const { body, param } = require('express-validator');

exports.createItemSchema = [
body('itemPurcCode')
    .exists()
    .withMessage('Codigo del Area de Compra es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('itemName')
    .exists()
    .withMessage('Nombre de la Clase de Articulo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('itemDescription')
    .exists()
    .withMessage('Descripcion de la Clase de Articulo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),        
body('itemItmcCode')
    .exists()
    .isNumeric()
    .withMessage('Familia del Clase de la Articulo es requerido'),
body('itemRenewalCycle')
    .exists()
    .isNumeric()
    .withMessage('Ciclo Renovacion de la Clase de Articulo es requerido'),    
body('itemMaintenanceCycle')
    .exists()
    .isNumeric()
    .withMessage('Ciclo Renovacion de la Clase de Articulo es requerido'),   
body('itemCurrencyCode')
    .exists()
    .withMessage('Codigo Moneda de la Clase de Articulo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),      
body('itemUnitValue')
    .exists()
    .isDecimal()
    .withMessage('Valor Unitario de la Clase de Articulo es requerido'),   
body('itemStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
 ];



exports.updateItemSchema = [
body('itemPurcCode')
    .exists()
    .withMessage('Codigo del Area de Compra es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('itemName')
    .exists()
    .withMessage('Nombre de la Clase de Articulo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('itemDescription')
    .exists()
    .withMessage('Descripcion de la Clase de Articulo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),        
body('itemItmcCode')
    .exists()
    .isNumeric()
    .withMessage('Familia del Clase de la Articulo es requerido'),
body('itemRenewalCycle')
    .exists()
    .isNumeric()
    .withMessage('Ciclo Renovacion de la Clase de Articulo es requerido'),    
body('itemMaintenanceCycle')
    .exists()
    .isNumeric()
    .withMessage('Ciclo Renovacion de la Clase de Articulo es requerido'),   
body('itemCurrencyCode')
    .exists()
    .withMessage('Codigo Moneda de la Clase de Articulo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),      
body('itemUnitValue')
    .exists()
    .isDecimal()
    .withMessage('Valor Unitario de la Clase de Articulo es requerido'),   
body('itemStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    ];

exports.deleteItemSchema = [
param('itemCode')
    .exists()
    .withMessage('Codigo del la Clase de Articulo es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
param('itemPurcCode')
    .exists()
    .withMessage('Codigo del Area de Compra es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres')
];
    