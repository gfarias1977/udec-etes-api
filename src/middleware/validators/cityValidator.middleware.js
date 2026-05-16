const { body, param } = require('express-validator');

exports.createCitySchema = [
body('cityCode')
    .exists()
    .withMessage('Codigo de la Ciudad es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('cityName')
    .exists()
    .withMessage('Nombre de la Ciudad es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),    
body('cityStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])  
 ];

exports.updateCitySchema = [
body('cityName')
    .exists()
    .withMessage('Nombre de la Ciudad es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),    
body('cityStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])  
];

exports.deleteCitySchema = [
param('cityCode')
    .exists()
    .withMessage('Codigo de la Ciudad es requerido')
];
    