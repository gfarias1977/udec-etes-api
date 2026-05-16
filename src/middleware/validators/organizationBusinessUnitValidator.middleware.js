const { body, param } = require('express-validator');

exports.createOrganizationBusinessUnitSchema = [
    body('ogbuOrgCode')
        .exists()
        .withMessage('Codigo de la Organizacion es requerido'),
    body('ogbuBuCode')
        .exists()
        .withMessage('Codigo del Area de Compra es requerido'),        
    body('ogbuStatus')
        .exists()
        .isIn(['S', 'N'])

];

exports.updateOrganizationBusinessUnitSchema = [
    body('ogbuStatus')
        .exists()
        .isIn(['S', 'N'])
];

    exports.deleteOrganizationBusinessUnitSchema = [
    param('ogbuOrgCode')
        .exists()
        .withMessage('Codigo de la Organizacion es requerido'),
    param('ogbuBuCode')
        .exists()
        .withMessage('Codigo del Area de Compra es requerido')
];
    