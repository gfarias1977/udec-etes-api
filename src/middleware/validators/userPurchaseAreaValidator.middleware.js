const { body, param } = require('express-validator');

exports.createUserPurchaseAreaSchema = [
    body('uspaUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    body('uspaPurcCode')
        .exists()
        .withMessage('Codigo del Area de Compra es requerido'),        
    body('uspaStatus')
        .exists()
        .isIn(['S', 'N'])

];

exports.updateUserPurchaseAreaSchema = [
    body('uspaStatus')
        .exists()
        .isIn(['S', 'N'])
];

    exports.deleteUserPurchaseAreaSchema = [
    param('uspaUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    param('uspaPurcCode')
        .exists()
        .withMessage('Codigo del Area de Compra es requerido')
];
    