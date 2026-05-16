const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const roleController = require('../../mvc/v1/controller/role.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createRoleSchema, deleteRoleSchema, updateRoleSchema } = require('../../middleware/validators/roleValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(roleController.getAllRoles)); 

router.get('/getOneById/', auth,[
    query('roleId', 'Id del rol es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(roleController.getRoleById)); 

router.get('/getAllByName/', auth,[
    query('roleName', 'Nombre del rol es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(roleController.getAllRolesByName)); 

router.post('/create/', auth, createRoleSchema, awaitHandlerFactory(roleController.createRole)); 

router.patch('/update/', auth,[
    query('roleId', 'Id del rol es obligatorio').not().isEmpty(),
    fieldsValidator], updateRoleSchema, awaitHandlerFactory(roleController.updateRole)); 

router.delete('/delete/', auth,[
    query('roleId', 'Id del rol es obligatorio').not().isEmpty(),
    fieldsValidator], deleteRoleSchema, awaitHandlerFactory(roleController.deleteRole)); 

module.exports = router;