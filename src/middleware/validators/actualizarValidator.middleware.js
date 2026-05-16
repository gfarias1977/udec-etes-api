const { body } = require('express-validator');

exports.updateCartonSchema = [
    body('usuario.*.usuario')
        .exists()
        .isString()
        .withMessage('Nombre de usuario es requerido')
        .isLength({ min: 6 })
        .withMessage('Debe tener al menos 6 caracteres'),
    body('usuario.*.contraseña')
        .exists()
        .isString()
        .withMessage('La contraseña es requerida')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe contener al menos 6 caracteres')
        .isLength({ max: 20 })
        .withMessage('La contraseña puede contener un máximo de 20 caracteres'),
    body('catalogo.CodBlt')
        .exists()
        .isString()
        .withMessage('CodBlt es requerido')
        .notEmpty(),
    body('catalogo.NroGui')
        .exists()
        .isString()
        .withMessage('NroGui es requerido')
        .notEmpty(),
    body('catalogo.newNroGui')
        .isString()
        .optional( { checkFalsy: true } ),
    body('catalogo.FecDes')
        .isString()
        .optional( { checkFalsy: true } ),
    body('catalogo.DirDes')
        .isString()
        .optional( { checkFalsy: true } )
        .custom(( value, { req }) => req.body.catalogo.DesCom )
        .withMessage('Debe informar el campo DesCom.'),
    body('catalogo.DesCom')
        .isString()
        .optional( { checkFalsy: true } )
        .custom(( value, { req }) => req.body.catalogo.DirDes )
        .withMessage('Debe informar el campo DirDes.'),
];

