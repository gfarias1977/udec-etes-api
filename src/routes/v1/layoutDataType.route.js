const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const LayoutDataTypeController = require('../../mvc/v1/controller/layoutDataType.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createLayoutDataTypeSchema, deleteLayoutDataTypeSchema, updateLayoutDataTypeSchema } = require('../../middleware/validators/layoutDataTypeValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(LayoutDataTypeController.getAllLayoutDataTypes)); 

router.get('/getOneById/', auth,[
    query('laydCode', 'Codigo del Tipo de Layout es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(LayoutDataTypeController.getLayoutDataTypeById)); 

router.get('/getAllByName/', auth,[
    query('laydName', 'Nombre del Tipo de Layout es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(LayoutDataTypeController.getAllLayoutDataTypesByName)); 

router.post('/create/', auth, createLayoutDataTypeSchema, awaitHandlerFactory(LayoutDataTypeController.createLayoutDataType)); 

router.patch('/update/', auth,[
    query('laydCode', 'Codigo del Tipo de Layout es obligatorio').not().isEmpty(),
    fieldsValidator], updateLayoutDataTypeSchema, awaitHandlerFactory(LayoutDataTypeController.updateLayoutDataType)); 

router.delete('/delete/', auth,[
    query('laydCode', 'Codigo del Tipo de Layout es obligatorio').not().isEmpty(),
    fieldsValidator], deleteLayoutDataTypeSchema, awaitHandlerFactory(LayoutDataTypeController.deleteLayoutDataType)); 

module.exports = router;