const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const OrganizationController = require('../../mvc/v1/controller/organization.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createOrganizationSchema, deleteOrganizationSchema, updateOrganizationSchema } = require('../../middleware/validators/organizationValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(OrganizationController.getAllOrganizations)); 

router.get('/getOneById/', auth,[
    query('orgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(OrganizationController.getOrganizationById)); 

router.get('/getAllByName/', auth,[
    query('orgDescription', 'Nombre de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(OrganizationController.getAllOrganizationsByName)); 

router.get('/getAllByUserId/', auth,[
    // query('orgUserId', 'Id de Usuario es obligatorio').not().isEmpty(), // no se usa porque se usa extrae del token de autenticación
    fieldsValidator],awaitHandlerFactory(OrganizationController.getAllOrganizationsByUserId)); 

router.post('/create/', auth, createOrganizationSchema, awaitHandlerFactory(OrganizationController.createOrganization)); 

router.patch('/update/', auth,[
    query('orgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator], updateOrganizationSchema, awaitHandlerFactory(OrganizationController.updateOrganization)); 

router.delete('/delete/', auth,[
    query('orgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator], deleteOrganizationSchema, awaitHandlerFactory(OrganizationController.deleteOrganization)); 

module.exports = router;