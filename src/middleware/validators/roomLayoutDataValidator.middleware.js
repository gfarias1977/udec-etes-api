const { body, param } = require('express-validator');

exports.createRoomLayoutDataSchema = [
    body('rladLaydCode')
        .exists()
        .withMessage('Codigo del Tipo de Layout es requerido'),
    body('rladRlayCode')
        .exists()
        .withMessage('Codigo del Recinto es requerido'),   
    body('rladDescription')
        .exists()
        .withMessage('Descripcio de la Data es requerido'),              
    body('rladData')
        .exists()
        .withMessage('Data es requerido')

];

exports.updateRoomLayoutDataSchema = [
    body('rladDescription')
        .exists()
        .withMessage('Descripcio de la Data es requerido'),              
    body('rladData')
        .exists()
        .withMessage('Data es requerido')
];

    exports.deleteRoomLayoutDataSchema = [
    param('rladLaydCode')
        .exists()
        .withMessage('Codigo del Tipo de Layout es requerido'),
    param('rladRlayCode')
        .exists()
        .withMessage('Codigo del Recinto es requerido')
];
    