const { body, param } = require('express-validator');

exports.createUserCampusSchema = [
    body('usrcUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    body('usrcCampCode')
        .exists()
        .withMessage('Codigo de la Sede es requerido'),        
    body('usrcStatus')
        .exists()
        .isIn(['S', 'N'])

];

exports.updateUserCampusSchema = [
    body('usrcStatus')
        .exists()
        .isIn(['S', 'N'])
];

    exports.deleteUserCampusSchema = [
    param('usrcUserId')
        .exists()
        .isNumeric()
        .withMessage('Codigo del Usuario es requerido'),
    param('usrcCampusCode')
        .exists()
        .withMessage('Codigo de la Sede es requerido')
];
    