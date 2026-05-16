const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ItemCategoryController = require('../../mvc/v1/controller/itemCategory.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createItemCategorySchema, deleteItemCategorySchema, updateItemCategorySchema } = require('../../middleware/validators/itemCategoryValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(ItemCategoryController.getAllItemCategories)); 

router.get('/getOneById/', auth,[
    query('itmcCode', 'Codigo de la Categoria es obligatorio').not().isEmpty(),
    query('itmcPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemCategoryController.getItemCategoryById)); 

router.get('/getAllByName/', auth,[
    query('itmcName', 'Nombre de la Categoria es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemCategoryController.getAllItemCategoriesByName)); 

router.get('/getAllByPurcCode/', auth,[
    //query('itmcPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemCategoryController.getAllItemCategoriesByPurcCode)); 

router.get('/getAllByParentCode/', auth,[
    //query('itmcPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    //query('itmcParentCode', 'Codigo de Categoria Padre es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ItemCategoryController.getAllItemCategoriesByParentCode)); 

router.post('/create/', auth, createItemCategorySchema, awaitHandlerFactory(ItemCategoryController.createItemCategory)); 

router.patch('/update/', auth,[
    query('itmcCode', 'Codigo de la Categoria es obligatorio').not().isEmpty(),
    query('itmcPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator], updateItemCategorySchema, awaitHandlerFactory(ItemCategoryController.updateItemCategory)); 

router.delete('/delete/', auth,[
    query('itmcCode', 'Codigo de la Categoria es obligatorio').not().isEmpty(),
    query('itmcPurcCode', 'Codigo del Area de Compra es obligatorio').not().isEmpty(),
    fieldsValidator], deleteItemCategorySchema, awaitHandlerFactory(ItemCategoryController.deleteItemCategory)); 

module.exports = router;