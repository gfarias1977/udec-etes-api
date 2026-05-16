const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ApplicationController = require('../../mvc/v1/controller/application.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createApplicationSchema, deleteApplicationSchema, updateApplicationSchema } = require('../../middleware/validators/applicationValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(ApplicationController.getAllApplications)); 

router.get('/getOneById/', auth,[
    query('appId', 'Id de la Aplicacion es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ApplicationController.getApplicationById)); 

router.get('/getAllByName/', auth,[
    query('appDescription', 'Nombre de la Aplicacion es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ApplicationController.getAllApplicationsByName)); 

router.post('/create/', auth, createApplicationSchema, awaitHandlerFactory(ApplicationController.createApplication)); 

router.patch('/update/', auth,[
    query('appId', 'Id de la Aplicacion es obligatorio').not().isEmpty(),
    fieldsValidator], updateApplicationSchema, awaitHandlerFactory(ApplicationController.updateApplication)); 

router.delete('/delete/', auth,[
    query('appId', 'Id de la Aplicacion es obligatorio').not().isEmpty(),
    fieldsValidator], deleteApplicationSchema, awaitHandlerFactory(ApplicationController.deleteApplication)); 

module.exports = router;