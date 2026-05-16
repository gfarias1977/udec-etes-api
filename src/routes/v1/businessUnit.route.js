const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const BusinessUnitController = require('../../mvc/v1/controller/businessUnit.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createBusinessUnitSchema, deleteBusinessUnitSchema, updateBusinessUnitSchema } = require('../../middleware/validators/businessUnitValidator.middleware');

router.get('/getAll/', [
    fieldsValidator],awaitHandlerFactory(BusinessUnitController.getAllBusinessUnits)); 

router.get('/getOneById/', auth,[
    query('buCode', 'Id del Unidad de Negocio es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(BusinessUnitController.getBusinessUnitById)); 

router.get('/getAllByName/', auth,[
    query('buName', 'Nombre de la Unidad de Negocio es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(BusinessUnitController.getAllBusinessUnitsByName)); 

router.post('/create/', auth, createBusinessUnitSchema, awaitHandlerFactory(BusinessUnitController.createBusinessUnit)); 

router.patch('/update/', auth,[
    query('buCode', 'Codigo de al Unidad de Negocio es obligatorio').not().isEmpty(),
    fieldsValidator], updateBusinessUnitSchema, awaitHandlerFactory(BusinessUnitController.updateBusinessUnit)); 

router.delete('/delete/', auth,[
    query('buCode', 'Codigo de la Unidad de Negocio es obligatorio').not().isEmpty(),
    fieldsValidator], deleteBusinessUnitSchema, awaitHandlerFactory(BusinessUnitController.deleteBusinessUnit)); 

module.exports = router;