const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const UserChargeAccountController = require('../../mvc/v1/controller/userChargeAccount.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createUserChargeAccountSchema, deleteUserChargeAccountSchema, updateUserChargeAccountSchema } = require('../../middleware/validators/userChargeAccountValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(UserChargeAccountController.getAllUserChargeAccounts)); 

router.get('/getOneById/', auth,[
    query('ucacUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('ucacPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    query('ucacCaccCode', 'Codigo del Centro de Costo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(UserChargeAccountController.getUserChargeAccountById)); 

    router.get('/getAllByName/', auth,[
        query('ucacName', 'Nombre es obligatorio').not().isEmpty(),
        fieldsValidator],awaitHandlerFactory(UserChargeAccountController.getAllUserChargeAccountsByName)); 
            

router.post('/create/', auth, createUserChargeAccountSchema, awaitHandlerFactory(UserChargeAccountController.createUserChargeAccount)); 

router.patch('/update/', auth,[
    query('ucacUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('ucacPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    query('ucacCaccCode', 'Codigo del Centro de Costo es obligatorio').not().isEmpty(),
    fieldsValidator], updateUserChargeAccountSchema, awaitHandlerFactory(UserChargeAccountController.updateUserChargeAccount)); 

router.delete('/delete/', auth,[
    query('ucacUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('ucacPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    query('ucacCaccCode', 'Codigo del Centro de Costo es obligatorio').not().isEmpty(),
    fieldsValidator], deleteUserChargeAccountSchema, awaitHandlerFactory(UserChargeAccountController.deleteUserChargeAccount)); 

module.exports = router;