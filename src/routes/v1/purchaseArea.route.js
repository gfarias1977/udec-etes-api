const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const purchaseArea = require('../../mvc/v1/controller/purchaseArea.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createPurchaseAreaSchema, deletePurchaseAreaSchema, updatePurchaseAreaSchema } = require('../../middleware/validators/purchaseAreaValidator.middleware');

router.get('/getAll/', [
    fieldsValidator],awaitHandlerFactory(purchaseArea.getAllPurchaseAreas)); 

router.get('/getOneById/', auth,[
    query('purcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(purchaseArea.getPurchaseAreaById)); 

router.get('/getAllByName/', auth,[
    query('purcName', 'Nombre del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(purchaseArea.getAllPurchaseAreasByName)); 

router.post('/create/', auth, createPurchaseAreaSchema, awaitHandlerFactory(purchaseArea.createPurchaseArea)); 

router.patch('/update/', auth,[
    query('purcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator], updatePurchaseAreaSchema, awaitHandlerFactory(purchaseArea.updatePurchaseArea)); 

router.delete('/delete/', auth,[
    query('purcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator], deletePurchaseAreaSchema, awaitHandlerFactory(purchaseArea.deletePurchaseArea)); 

module.exports = router;