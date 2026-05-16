const { body } = require('express-validator');

exports.authLoginSchema = [
    body('username')
        .exists()
        .withMessage('Código de usuario es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('password')
        .exists()
        .withMessage('La contraseña es requerida')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe contener al menos 6 caracteres')
        .isLength({ max: 20 })
        .withMessage('La contraseña puede contener un máximo de 20 caracteres'),
    body('userCompany')
        .exists()
        .isNumeric()
        .withMessage('Código de compañía es requerido'),
];
