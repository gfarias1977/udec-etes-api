const { body, param } = require('express-validator');

exports.createRoomLayoutSchema = [
    body('rlayCode')
        .exists()
        .withMessage('Codigo del Recinto Prototipo es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 6 caracteres'),    
    body('rlayRlatCode')
        .exists()
        .withMessage('Codigo del Tipo de Recinto Prototipo es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 6 caracteres'),          
    body('rlayDescription')
        .exists()
        .withMessage('Nombre del Recinto Prototipo es requerido')
        .isLength({ min: 10 })
        .withMessage('Debe tener al menos 10 caracteres'),
    body('rlayCapacity')
        .exists()
        .isNumeric()
        .withMessage('Capacidad del Recinto Prototipo es requerido'),
     body('rlayStatus')
        .exists()
        .isIn(['S', 'N']),
];

exports.updateRoomLayoutSchema = [
    body('rlayDescription')
        .exists()
        .withMessage('Nombre del Recinto Prototipo es requerido, debe contener sólo caracteres alfabéticos')
        .isLength({ min: 6 })
        .withMessage('Debe tener al menos 6 caracteres'),
    body('rlayCapacity')
        .exists()
        .isNumeric()
        .withMessage('Descripcion del Recinto Prototipo es requerido, debe contener sólo caracteres alfabéticos'),
    body('rlayStatus')
        .exists()
        .withMessage('Deben ser sólo caracteres alfabéticos')
        .isIn( [ 'N', 'S'])
        .isLength({ min: 1, max: 1 }),
    ];

    exports.deleteRoomLayoutSchema = [
        param('rlayCode')
            .exists()
            .withMessage('Codigo del Recinto Prototipoes requerido')
            .isLength({ min: 6 })
            .withMessage('Debe tener al menos 6 caracteres'),
    ];
    