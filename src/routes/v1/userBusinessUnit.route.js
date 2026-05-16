const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const UserBusinessUnitController = require('../../mvc/v1/controller/userBusinessUnit.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createUserBusinessUnitSchema, deleteUserBusinessUnitSchema, updateUserBusinessUnitSchema } = require('../../middleware/validators/userBusinessUnitValidator.middleware');


router.get('/getAll/', auth, [
    fieldsValidator],awaitHandlerFactory(UserBusinessUnitController.getAllUserBusinessUnits)); 

router.get('/getAllBusinessUnitsByUserId/', auth,
/*     [
        query('usroUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
        fieldsValidator] 
        ,*/
        awaitHandlerFactory(UserBusinessUnitController.getAllBusinessUnitsByUserId));         

router.get('/getOneById/', auth,[
    query('usbuUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('usbuBuCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(UserBusinessUnitController.getUserBusinessUnitById)); 

    router.get('/getOneByUserName/', [
        query('usbuUserName', 'Cuenta de Usuario es obligatorio').not().isEmpty(),
        query('usbuBuCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
        fieldsValidator],awaitHandlerFactory(UserBusinessUnitController.getUserBusinessUnitByUserName)); 


router.get('/getAllByName/', auth,[
        query('usbuName', 'Nombre es obligatorio').not().isEmpty(),
        fieldsValidator],awaitHandlerFactory(UserBusinessUnitController.getAllUserBusinessUnitByName)); 
            

router.post('/create/', auth, createUserBusinessUnitSchema, awaitHandlerFactory(UserBusinessUnitController.createUserBusinessUnit)); 
router.post('/createUserBusinessUnits/', auth,  awaitHandlerFactory(UserBusinessUnitController.createUserBusinessUnits)); 

router.patch('/update/', auth,[
    query('usbuUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('usbuBuCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
    fieldsValidator], updateUserBusinessUnitSchema, awaitHandlerFactory(UserBusinessUnitController.updateUserBusinessUnit)); 

router.delete('/delete/', auth,[
    query('usbuUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('usbuBuCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
    fieldsValidator], deleteUserBusinessUnitSchema, awaitHandlerFactory(UserBusinessUnitController.deleteUserBusinessUnit)); 

module.exports = router;