const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ChargeAccountController = require('../../mvc/v1/controller/chargeAccount.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createChargeAccountSchema, deleteChargeAccountSchema, updateChargeAccountSchema } = require('../../middleware/validators/chargeAccountValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(ChargeAccountController.getAllChargeAccount)); 

router.get('/getOneById/', auth,[
    query('caccCode', 'Codigo del Centro de Costo es obligatorio').not().isEmpty(),
    query('caccOrgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ChargeAccountController.getChargeAccountById)); 

router.get('/getAllByName/', auth,[
    query('caccDescription', 'Nombre del Centro de Costo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ChargeAccountController.getAllChargeAccountByName)); 

router.get('/getAllByUserId/', auth,[
    query('caccUserId', 'Id de Usuario es obligatorio').not().isEmpty(),
    query('caccOrgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ChargeAccountController.getAllChargeAccountByUserId)); 

router.post('/create/', auth, createChargeAccountSchema, awaitHandlerFactory(ChargeAccountController.createChargeAccount)); 

router.patch('/update/', auth,[
    query('caccCode', 'Codigo del Centro de Costo es obligatorio').not().isEmpty(),
    query('caccOrgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator], updateChargeAccountSchema, awaitHandlerFactory(ChargeAccountController.updateChargeAccount)); 

router.delete('/delete/', auth,[
    query('caccCode', 'Codigo del Centro de Costo es obligatorio').not().isEmpty(),
    query('caccOrgCode', 'Codeigo de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator], deleteChargeAccountSchema, awaitHandlerFactory(ChargeAccountController.deleteChargeAccount)); 

module.exports = router;