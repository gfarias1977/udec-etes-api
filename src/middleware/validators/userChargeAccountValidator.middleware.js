const { body, param } = require('express-validator');

exports.createUserChargeAccountSchema = [
    body('ucacUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    body('ucacPurcCode')
        .exists()
        .withMessage('Codigo del Area de Compra es requerido'),        
    body('ucacCaccCode')
        .exists()
        .withMessage('Codigo del Centro de Costo es requerido'),
    body('ucacStatus')
        .exists()
        .isIn(['S', 'N'])

];

exports.updateUserChargeAccountSchema = [
    body('ucacStatus')
        .exists()
        .isIn(['S', 'N'])
];

    exports.deleteUserChargeAccountSchema = [
    param('ucacUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    param('ucacPurcCode')
        .exists()
        .withMessage('Codigo del Area de Compra es requerido'),        
    param('ucacCaccCode')
        .exists()
        .withMessage('Codigo del Centro de Costo es requerido')
];
    