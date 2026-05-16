const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const UserPurchaseAreaController = require('../../mvc/v1/controller/userPurchaseArea.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createUserPurchaseAreaSchema, deleteUserPurchaseAreaSchema, updateUserPurchaseAreaSchema } = require('../../middleware/validators/userPurchaseAreaValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(UserPurchaseAreaController.getAllUserPurchaseAreas)); 

router.get('/getAllPurchaseAreasByUserId/',
/*     [
        query('usroUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
        fieldsValidator] 
        ,*/
        awaitHandlerFactory(UserPurchaseAreaController.getUserPurchaseAreasByUserId));        

router.get('/getOneById/', auth,[
    query('uspaUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('uspaPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(UserPurchaseAreaController.getUserPurchaseAreaById)); 

router.get('/getOneByUserName/', [
    query('uspaUserName', 'Cuenta de Usuario es obligatorio').not().isEmpty(),
    query('uspaPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(UserPurchaseAreaController.getUserPurchaseAreaByUserName)); 

        
router.get('/getAllByName/', auth,[
        query('uspaName', 'Nombre es obligatorio').not().isEmpty(),
        fieldsValidator],awaitHandlerFactory(UserPurchaseAreaController.getAllUserPurchaseAreaByName)); 
            

router.post('/create/', auth, createUserPurchaseAreaSchema, awaitHandlerFactory(UserPurchaseAreaController.createUserPurchaseArea)); 
router.post('/createUserPurchaseAreas/', awaitHandlerFactory(UserPurchaseAreaController.createUserPurchaseAreas)); 

router.patch('/update/', auth,[
    query('uspaUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('uspaPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator], updateUserPurchaseAreaSchema, awaitHandlerFactory(UserPurchaseAreaController.updateUserPurchaseArea)); 

router.delete('/delete/', auth,[
    query('uspaUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('uspaPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator], deleteUserPurchaseAreaSchema, awaitHandlerFactory(UserPurchaseAreaController.deleteUserPurchaseArea)); 

module.exports = router; 