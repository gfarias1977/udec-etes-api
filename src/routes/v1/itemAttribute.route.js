const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ItemAttributeController = require('../../mvc/v1/controller/itemAttribute.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createItemAttributeSchema, deleteItemAttributeSchema, updateItemAttributeSchema } = require('../../middleware/validators/itemAttributeValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(ItemAttributeController.getAllItemAttributes)); 

router.get('/getAllByPurcCode/', auth,[
   // query('itmaPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemAttributeController.getAllItemAttributesByPurcCode)); 

router.get('/getOneById/', auth,[
    query('itmaCode', 'Codigo del Atributo es obligatorio').not().isEmpty(),
    query('itmaPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemAttributeController.getItemAttributeById)); 

router.get('/getAllByName/', auth,[
    query('itmaCode', 'Codigo del Atributo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemAttributeController.getAllItemAttributesByName)); 

router.post('/create/', auth, createItemAttributeSchema, awaitHandlerFactory(ItemAttributeController.createItemAttribute)); 

router.patch('/update/', auth,[
    query('itmaCode', 'Codigo del Atributo es obligatorio').not().isEmpty(),
    query('itmaPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator], updateItemAttributeSchema, awaitHandlerFactory(ItemAttributeController.updateItemAttribute)); 

router.delete('/delete/', auth,[
    query('itmaCode', 'Codigo del Atributo es obligatorio').not().isEmpty(),
    query('itmaPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator], deleteItemAttributeSchema, awaitHandlerFactory(ItemAttributeController.deleteItemAttribute)); 

module.exports = router;