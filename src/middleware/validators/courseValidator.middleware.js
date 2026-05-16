const { body, param } = require('express-validator');

exports.createCourseSchema = [
body('coursCode')
    .exists()
    .withMessage('Codigo de la Carrera es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),   
body('coursOrgCode')
    .exists()
    .withMessage('Codigo de la Organizacion es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('coursSchoCode')
    .exists()
    .withMessage('Codigo de la Unidad Academica es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('coursShortDescription')
    .exists()
    .withMessage('Descripcion corta de la Carrera es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('coursDescription')
    .exists()
    .withMessage('Descripcion de la Carrera es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('coursType')
    .exists()
    .isAlpha()
    .withMessage('Tipo de Carrera es requerido')
    .isLength({ min: 1, max:1 }),
body('coursMethod')
    .exists()
    .isAlpha()
    .withMessage('Methodo de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),
body('coursDuration')
    .exists()
    .isAlpha()
    .withMessage('Duracion de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),    
body('coursModality')
    .exists()
    .isAlpha()
    .withMessage('Modalidad de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),     
body('coursElearning')
    .exists()
    .isAlpha()
    .withMessage('Es Elearning de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),  
body('coursClinicalField')
    .exists()
    .isAlpha()
    .withMessage('Campo Clinico de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),      
body('coursStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    .isLength({ min: 1, max: 1 }),  
];


exports.updateCourseSchema = [
body('coursOrgCode')
    .exists()
    .withMessage('Codigo de la Organizacion es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('coursSchoCode')
    .exists()
    .withMessage('Codigo de la Unidad Academica es requerido')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),
body('coursShortDescription')
    .exists()
    .withMessage('Descripcion corta de la Carrera es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('coursDescription')
    .exists()
    .withMessage('Descripcion de la Carrera es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 4 caracteres'),
body('coursType')
    .exists()
    .isAlpha()
    .withMessage('Tipo de Carrera es requerido')
    .isLength({ min: 1, max:1 }),
body('coursMethod')
    .exists()
    .isAlpha()
    .withMessage('Methodo de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),
body('coursDuration')
    .exists()
    .isAlpha()
    .withMessage('Duracion de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),    
body('coursModality')
    .exists()
    .isAlpha()
    .withMessage('Modalidad de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),     
body('coursElearning')
    .exists()
    .isAlpha()
    .withMessage('Es Elearning de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),  
body('coursClinicalField')
    .exists()
    .isAlpha()
    .withMessage('Campo Clinico de la Carrera es requerido')
    .isLength({ min: 1, max:1 }),      
body('coursStatus')
    .optional()
    .isAlpha()
    .withMessage('Deben ser sólo caracteres alfabéticos')
    .isIn( [ 'N', 'S'])
    .isLength({ min: 1, max: 1 }),    
];


exports.deleteCourseSchema = [
param('coursCode')
    .exists()
    .withMessage('Codigo del Carrera es requerido')
    .isLength({ min: 4 })
    .withMessage('Debe tener al menos 6 caracteres'),
];
    