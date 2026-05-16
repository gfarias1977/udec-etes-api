const { body, param } = require('express-validator');

exports.createCampusSchema = [
body('campCode')
    .exists()
    .withMessage('Codigo del Campus es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),   
body('campOrgCode')
    .exists()
    .isAlpha()
    .withMessage('Codigo de la Organizacion es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('campDescription')
    .exists()
    .isAlpha()
    .withMessage('Descripcion del Campus es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('campType')
    .exists()
    .isAlpha()
    .withMessage('Tipo del Campus es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 1 , max: 1 })
    .withMessage('Debe tener  1 caracteres'),
body('campAddress')
    .exists()
    .withMessage('Direccion del Campus es requerido')
    .isLength({ min: 10})
    .withMessage('Debe tener al menos 10 caracteres'),    
body('campDepartment')
    .exists()
    .withMessage('Comuna del Campus es requerido'),
body('campCity')
    .exists()
    .withMessage('Ciudad del Campus es requerido') ,
body('campStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    .isLength({ min: 1, max: 1 }),  
];

exports.updateCampusSchema = [
body('campOrgCode')
    .exists()
    .isAlpha()
    .withMessage('Codigo de la Organizacion es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('campDescription')
    .exists()
    .isAlpha()
    .withMessage('Descripcion del Campus es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('campType')
    .exists()
    .isAlpha()
    .withMessage('Tipo del Campus es requerido, debe contener sólo caracteres alfabéticos')
    .isLength({ min: 1 , max: 1 })
    .withMessage('Debe tener  1 caracteres'),
body('campAddress')
    .exists()
    .withMessage('Direccion del Campus es requerido')
    .isLength({ min: 10})
    .withMessage('Debe tener al menos 10 caracteres'),    
body('campDepartment')
    .exists()
    .withMessage('Comuna del Campus es requerido'),
body('campCity')
    .exists()
    .withMessage('Ciudad del Campus es requerido') ,
body('campStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    .isLength({ min: 1, max: 1 }),  
    ];


exports.deleteCampusSchema = [
        param('campCode')
            .exists()
            .withMessage('Codigo del Campus es requerido')
            .isLength({ min: 4 })
            .withMessage('Debe tener al menos 6 caracteres'),
    ];
    