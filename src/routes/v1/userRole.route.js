const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const UserRoleController = require('../../mvc/v1/controller/userRole.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createUserRoleSchema, deleteUserRoleSchema, updateUserRoleSchema } = require('../../middleware/validators/userRoleValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(UserRoleController.getAllUserRoles)); 
/* 
router.get('/getOneById/', auth,[
    query('usroUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('usroRoleId', 'Codigo del Role es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(UserRoleController.getUserRoleById));  */

router.get('/getAllRolesByUserId/', auth,
/*     [
        query('usroUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
        fieldsValidator] 
        ,*/
        awaitHandlerFactory(UserRoleController.getUserRolesById));     

router.get('/getAllByName/', auth,[
        query('usroName', 'Nombre es obligatorio').not().isEmpty(),
        fieldsValidator],awaitHandlerFactory(UserRoleController.getAllUserRoleByName)); 
            
router.post('/create/', auth, createUserRoleSchema, awaitHandlerFactory(UserRoleController.createUserRole)); 
router.post('/createUserRoles/', auth,  awaitHandlerFactory(UserRoleController.createUserRoles)); 

router.patch('/update/', auth,[
    query('usroUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('usroRoleId', 'Codigo del Role es obligatorio').not().isEmpty(),
    fieldsValidator], updateUserRoleSchema, awaitHandlerFactory(UserRoleController.updateUserRole)); 

router.delete('/delete/', auth,[
    query('usroUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('usroRoleId', 'Codigo del Role es obligatorio').not().isEmpty(),
    fieldsValidator], deleteUserRoleSchema, awaitHandlerFactory(UserRoleController.deleteUserRole)); 

module.exports = router;