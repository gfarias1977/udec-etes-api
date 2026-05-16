const { body, param } = require('express-validator');

exports.createUserRoleSchema = [
    body('usroUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    body('usroRoleId')
        .exists()
        .withMessage('Codigo del Role es requerido'),        
    body('usroStatus')
        .exists()
        .isIn(['S', 'N'])

];

exports.updateUserRoleSchema = [
    body('usroStatus')
        .exists()
        .isIn(['S', 'N'])
];

    exports.deleteUserRoleSchema = [
    param('usroUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    param('usroRoleId')
        .exists()
        .withMessage('Codigo del Role es requerido')
];
    