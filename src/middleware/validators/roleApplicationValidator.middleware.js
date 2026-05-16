const { body, param } = require('express-validator');

exports.createRoleApplicationSchema = [
    body('rlapRoleId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    body('rlapAppId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Area de Compra es requerido'),        
    body('rlapStatus')
        .exists()
        .isIn(['S', 'N'])

];

exports.updateRoleApplicationSchema = [
    body('rlapStatus')
        .exists()
        .isIn(['S', 'N'])
];

    exports.deleteRoleApplicationSchema = [
    param('rlapRoleId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    param('rlapAppId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Area de Compra es requerido')
];
    