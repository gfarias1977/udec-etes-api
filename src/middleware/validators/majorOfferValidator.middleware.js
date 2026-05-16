const { body, param } = require('express-validator');

exports.createMajorOfferSchema = [
    body('maofCampCode')
        .exists()
        .withMessage('Codigo de la Sede es requerido'),
    body('maofAcademicYear')
        .exists()
        .withMessage('Año Academico es requerido'),        
    body('maofMajorCode')
        .exists()
        .withMessage('Codigo de la Carrera es requerido'),
    body('maofPlanCode')
        .exists()
        .withMessage('Codigo del Plan es requerido'),  
    body('maofWktCode')
        .exists()
        .withMessage('Codigo de la Jornada es requerido'),                            
    body('maofMin')
        .exists()
        .withMessage('Minimo es requerido'),
    body('maofOffer')
        .exists()
        .withMessage('Oferta es requerido'),  
    body('maofOfferType')
        .exists()
        .withMessage('Tipo de Oferta es requerido')             
        .isIn(['REG', 'CON']),

];

exports.updateMajorOfferSchema = [
    body('maofMin')
        .exists()
        .withMessage('Minimo es requerido'),
    body('maofOffer')
        .exists()
        .withMessage('Oferta es requerido'),  
    body('maofOfferType')
        .exists()
        .withMessage('Tipo de Oferta es requerido')             
        .isIn(['REG', 'CON']),
    ];

    exports.deleteMajorOfferSchema = [
    param('maofCampCode')
        .exists()
        .withMessage('Codigo de la Sede es requerido'),
    param('maofAcademicYear')
        .exists()
        .withMessage('Año Academico es requerido'),        
    param('maofMajorCode')
        .exists()
        .withMessage('Codigo de la Carrera es requerido'),
    param('maofPlanCode')
        .exists()
        .withMessage('Codigo del Plan es requerido'),  
    param('maofWktCode')
        .exists()
        .withMessage('Codigo de la Jornada es requerido')
    ];
    