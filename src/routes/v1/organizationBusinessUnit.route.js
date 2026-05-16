const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const OrganizationBusinessUnitController = require('../../mvc/v1/controller/organizationBusinessUnit.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createOrganizationBusinessUnitSchema, deleteOrganizationBusinessUnitSchema, updateOrganizationBusinessUnitSchema } = require('../../middleware/validators/organizationBusinessUnitValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(OrganizationBusinessUnitController.getAllOrganizationBusinessUnits)); 

router.get('/getOneById/', auth,[
    query('ogbuOrgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    query('ogbuBuCode', 'Codigo de la Unidad de Negocio es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(OrganizationBusinessUnitController.getOrganizationBusinessUnitById)); 

router.get('/getAllByName/', auth,[
    query('ogbuName', 'Nombre es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(OrganizationBusinessUnitController.getAllOrganizationBusinessUnitsByName)); 
            

router.post('/create/', auth, createOrganizationBusinessUnitSchema, awaitHandlerFactory(OrganizationBusinessUnitController.createOrganizationBusinessUnit)); 

router.patch('/update/', auth,[
    query('ogbuOrgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    query('ogbuBuCode', 'Codigo de la Unidad de Negocio es obligatorio').not().isEmpty(),
    fieldsValidator], updateOrganizationBusinessUnitSchema, awaitHandlerFactory(OrganizationBusinessUnitController.updateOrganizationBusinessUnit)); 

router.delete('/delete/', auth,[
    query('ogbuOrgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    query('ogbuBuCode', 'Codigo de la Unidad de Negocio es obligatorio').not().isEmpty(),
    fieldsValidator], deleteOrganizationBusinessUnitSchema, awaitHandlerFactory(OrganizationBusinessUnitController.deleteOrganizationBusinessUnit)); 

module.exports = router;