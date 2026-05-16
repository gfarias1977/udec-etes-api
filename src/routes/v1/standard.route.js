const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const standardController = require('../../mvc/v1/controller/standard.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createStandardSchema, deleteStandardSchema, updateStandardSchema , enableDisableStandardSchema} = require('../../middleware/validators/standardValidator.middleware');

router.get('/getAllByUser/',auth, [
    query('businessUnitCode', 'Código de Unidad de Neogocio es obligatorio').not().isEmpty(),
    query('purchaseAreaCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    fieldsValidator
],awaitHandlerFactory(standardController.getAllStandarsByUserId));  

router.get('/getStandardApplieToMajor/',auth, [
    query('purcCode', 'Código de Area de Gestión es obligatorio').not().isEmpty(),
    query('buCode', 'Código de Unidad de Negocio es obligatorio').not().isEmpty(),
    query('majorCode', 'Código de Carrera es obligatorio').not().isEmpty(),
    query('stdCode', 'Código de Estandard es obligatorio').not().isEmpty(),
    query('stdVersion', 'Version del estandard es obligatorio').not().isEmpty(),
    fieldsValidator
],awaitHandlerFactory(standardController.getStandardApplieToMajor));  


router.get('/getStandardApplieToRoomLayout/',auth, [
    query('purcCode', 'Código de Area de Gestión es obligatorio').not().isEmpty(),
    query('buCode', 'Código de Unidad de Negocio es obligatorio').not().isEmpty(),
    query('rlayCode', 'Código de Recinto Prototipo es obligatorio').not().isEmpty(),
    query('stdCode', 'Código de Estandard es obligatorio').not().isEmpty(),
    query('stdVersion', 'Version del estandard es obligatorio').not().isEmpty(),
    fieldsValidator
],awaitHandlerFactory(standardController.getStandardApplieToRoomLayout));  


router.get('/getStandardEquipmentByMajor/',auth, [
    query('majorCode', 'Código de Carrera es obligatorio').not().isEmpty(),
    query('progCode', 'Código de Plan es obligatorio').not().isEmpty(),
    query('purcCode', 'Código de Area de Gestión es obligatorio').not().isEmpty(),
    fieldsValidator
],awaitHandlerFactory(standardController.getStandardEquipmentByMajor));  


router.get('/getOneById/',auth, [
    query('stdCode', 'Codigo de Estandar es obligatorio').not().isEmpty(),
    query('stdOrgCode', 'Código de Organizacion es obligatorio').not().isEmpty(),
    query('stdBuCode', 'Código de Unidad de Neogocio es obligatorio').not().isEmpty(),
    query('stdPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdYear', 'Año es obligatorio').not().isEmpty(),
    query('stdVersion', 'Version es obligatorio').not().isEmpty(),
    query('stdUserId', 'Id Usuario es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(standardController.getStandardById)); 

router.get('/getAllBySearch/',auth, [
    //query('stdCode', 'Codigo de Estandar es obligatorio')..isEmpty(),
    //query('stdOrgCode', 'Código de Organizacion es obligatorio').isEmpty(),
    query('stdBuCode', 'Código de Unidad de Neogocio es obligatorio').not().isEmpty(),
    query('stdPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    //query('stdYear', 'Año es obligatorio').isEmpty(),
    //query('stdVersion', 'Version es obligatorio').isEmpty(),
    //query('stdUserId', 'Id Usuario es obligatorio').not().isEmpty(),
    //query('stdPurchase', 'Disponible para Compra es obligatorio').isEmpty(),
    fieldsValidator],awaitHandlerFactory(standardController.getStandardBySearch)); 

router.post('/create/', auth, createStandardSchema, awaitHandlerFactory(standardController.createStandard));

router.patch('/update/', auth, [
    query('stdCode', 'Codigo de Estandar es obligatorio').not().isEmpty(),
    query('stdPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdVersion', 'Version es obligatorio').not().isEmpty(),
    fieldsValidator],updateStandardSchema, awaitHandlerFactory(standardController.updateStandard)); 

router.delete('/delete/', auth, [
    query('stdCode', 'Codigo de Estandar es obligatorio').not().isEmpty(),
    query('stdOrgCode', 'Código de Organizacion es obligatorio').not().isEmpty(),
    query('stdBuCode', 'Código de Unidad de Neogocio es obligatorio').not().isEmpty(),
    query('stdPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdVersion', 'Version es obligatorio').not().isEmpty(),
    fieldsValidator],deleteStandardSchema, awaitHandlerFactory(standardController.deleteStandard)); 
 
router.put('/enableDisable/', auth, [
    //query('stdCode', 'Codigo de Estandar es obligatorio').not().isEmpty(),
   // query('stdOrgCode', 'Código de Organizacion es obligatorio').not().isEmpty(),
   // query('stdBuCode', 'Código de Unidad de Neogocio es obligatorio').not().isEmpty(),
   // query('stdPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
   // query('stdVersion', 'Version es obligatorio').not().isEmpty(),
    fieldsValidator],enableDisableStandardSchema, awaitHandlerFactory(standardController.enableDisableStandard)); 


router.get('/getBookCoverage/',auth, [
    query('orgCode', 'Código de la institucion es obligatorio').not().isEmpty(),
    //query('majorCode', 'Código de la carrera es obligatorio').not().isEmpty(),
    //query('progCode', 'Código del plan es obligatorio').not().isEmpty(),
    //query('cityCode', 'Código de la ciudad obligatorio').not().isEmpty(),
    query('idStd', 'id de la fuente estandard es obligatorio').not().isEmpty(),
    query('idDda', 'id de la fuente demanda es obligatorio').not().isEmpty(),
    query('idStock', 'id de la fuente stock es obligatorio').not().isEmpty(),
    fieldsValidator ],awaitHandlerFactory(standardController.getBookCoverage));  

module.exports = router;  