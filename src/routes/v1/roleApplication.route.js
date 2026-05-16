const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const RoleApplicationController = require('../../mvc/v1/controller/roleApplication.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createRoleApplicationSchema, deleteRoleApplicationSchema, updateRoleApplicationSchema } = require('../../middleware/validators/roleApplicationValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(RoleApplicationController.getAllRoleApplications)); 

router.get('/getOneById/', auth,[
    query('rlapRoleId', 'Codigo del Role es obligatorio').not().isEmpty(),
    query('rlapAppId', 'Codigo de la Applicacion  es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RoleApplicationController.getRoleApplicationById)); 

router.get('/getAllByName/', auth,[
        query('rlapName', 'Nombre es obligatorio').not().isEmpty(),
        fieldsValidator],awaitHandlerFactory(RoleApplicationController.getAllRoleApplicationByName)); 
            

router.post('/create/', auth, createRoleApplicationSchema, awaitHandlerFactory(RoleApplicationController.createRoleApplication)); 

router.patch('/update/', auth,[
    query('rlapRoleId', 'Codigo del Role es obligatorio').not().isEmpty(),
    query('rlapAppId', 'Codigo de la Applicacion  es obligatorio').not().isEmpty(),
    fieldsValidator], updateRoleApplicationSchema, awaitHandlerFactory(RoleApplicationController.updateRoleApplication)); 

router.delete('/delete/', auth,[
    query('rlapRoleId', 'Codigo del Role es obligatorio').not().isEmpty(),
    query('rlapAppId', 'Codigo de la Applicacion  es obligatorio').not().isEmpty(),
    fieldsValidator], deleteRoleApplicationSchema, awaitHandlerFactory(RoleApplicationController.deleteRoleApplication)); 

module.exports = router;