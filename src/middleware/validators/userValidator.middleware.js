const { body, param, query } = require('express-validator');

exports.deleteUserSchema = [
    query('userId')
        .exists()
        .withMessage('Código de usuario es requerido')
        .isInt(),
];

exports.createUserSchema = [
    body('userCompay')
        .exists()
        .isNumeric()
        .withMessage('Código de compañía es requerido'),
    body('userFirstname')
        .exists()
        .withMessage('Nombre del usuario es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userMiddlename')
        .optional(),
    body('userLastname')
        .exists()
        .withMessage('Apellido paterno del usuario es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userSurname')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userAddress')
        .exists()
        .withMessage('Debe ingresar dirección del usuario')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userEmail')
        .exists()
        .withMessage('Email es requerido')
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),
    body('userPersonalEmail')
        .optional()
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),
    body('userTelephone')
        .optional(),
    body('userCellphone')
        .optional(),
    body('userName')
        .exists()
        .withMessage('Código de usuario es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userGender')
        .optional()
        .isIn(['M', 'F', 'N']),
    body('userPassword')
        .exists()
        .withMessage('La contraseña es requerida')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe contener al menos 6 caracteres')
        .isLength({ max: 20 })
        .withMessage('La contraseña puede contener un máximo de 20 caracteres'),
    body('userTaxPayer')
        .exists()
        .withMessage('Debe ingresar RUT del usuario')
        .isLength({ min: 9 })
        .withMessage('Debe tener al menos 9 caracteres'),
    body('userStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateUserSchema = [
    param('userId')
        .exists()
        .withMessage('Código de usuario es requerido')
        .isInt(),
    body('userFirstname')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userMiddlename')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userLastname')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userSurname')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userAddress')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userEmail')
        .optional()
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),
    body('userPersonalEmail')
        .optional()
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),
    body('userTelephone')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userCellphone')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userGender')
        .optional()
        .isIn(['M', 'F', 'N']),
    body('userTaxPayer')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    body('userStatus')
        .optional()
        .isIn(['S', 'N']),
    body('userPassword')
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe contener al menos 6 caracteres')
        .isLength({ max: 12 })
        .withMessage('La contraseña puede contener un máximo de 12 caracteres')
        .custom((value, { req }) => !!req.body.confirmUserPassword)
        .withMessage('Por favor, confirme su contraseña'),
    body('confirmUserPassword')
        .optional()
        .custom((value, { req }) => value === req.body.userPassword)
        .withMessage('El campo confirmUserPassword debe tener el mismo valor que el campo userPassword'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Por favor, proporcione el campo requerido para actualizar')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = [ 
                'userFirstname',
                'userMiddlename',
                'userLastname',
                'userSurname',
                'userAddress',
                'userEmail',
                'userPersonalEmail',
                'userTelephone',
                'userCellphone',
                'userGender',
                'userTaxPayer',
                'userStatus',
                'userPassword',
                'confirmUserPassword',
            ];
            
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('¡Actualizaciones no válidas!')
];