const { body, param } = require('express-validator');

exports.createUserBusinessUnitSchema = [
    body('usbuUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    body('usbuBuCode')
        .exists()
        .withMessage('Codigo de la Unidad de Negocio es requerido'),        
    body('usbuStatus')
        .exists()
        .isIn(['S', 'N'])

];

exports.updateUserBusinessUnitSchema = [
    body('usbuStatus')
        .exists()
        .isIn(['S', 'N'])
];

    exports.deleteUserBusinessUnitSchema = [
    param('usbuUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    param('usbuBuCode')
        .exists()
        .withMessage('Codigo de la Unidad de Negocio es requerido')
];
    