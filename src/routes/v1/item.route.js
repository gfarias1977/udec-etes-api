const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ItemController = require('../../mvc/v1/controller/item.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createItemSchema, deleteItemSchema, updateItemSchema } = require('../../middleware/validators/itemValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(ItemController.getAllItems)); 

router.get('/getOneById/', auth,[
    query('itemCode', 'Codigo de la Clase de Articulo es obligatorio').not().isEmpty(),
    query('itemPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemController.getItemById)); 

router.get('/getAllByName/', auth,[
    query('itemName', 'Nombre de la Clase de Articulo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemController.getAllItemsByName)); 

router.get('/getAllItemsByParentCode/', auth,[
    query('itemItmcCode', 'Codigo de la Familia de Articulo es obligatorio').not().isEmpty(),
    query('itemPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemController.getAllItemsByParentCode)); 

router.post('/create/', auth, createItemSchema, awaitHandlerFactory(ItemController.createItem)); 

router.patch('/update/', auth,[
    query('itemCode', 'Codigo de la Clase de Articulo es obligatorio').not().isEmpty(),
    fieldsValidator], updateItemSchema, awaitHandlerFactory(ItemController.updateItem)); 

router.delete('/delete/', auth,[
    query('itemCode', 'Codigo de la Clase de Articulo es obligatorio').not().isEmpty(),
    fieldsValidator], deleteItemSchema, awaitHandlerFactory(ItemController.deleteItem)); 

module.exports = router;