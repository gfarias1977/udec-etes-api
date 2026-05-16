const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const RealStateRoomTypeController = require('../../mvc/v1/controller/realStateRoomType.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createRealStateRoomTypeSchema, deleteRealStateRoomTypeSchema, updateRealStateRoomTypeSchema } = require('../../middleware/validators/realStateRoomTypeValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(RealStateRoomTypeController.getAllRealStateRoomTypes)); 

router.get('/getOneById/', auth,[
    query('rsrtCode', 'Codigo de la Recinto Tipo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RealStateRoomTypeController.getRealStateRoomTypeById)); 

router.get('/getAllByName/', auth,[
    query('rsrtName', 'Nombre de la Recinto Tipo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RealStateRoomTypeController.getAllRealStateRoomTypeByName)); 

router.post('/create/', auth, createRealStateRoomTypeSchema, awaitHandlerFactory(RealStateRoomTypeController.createRealStateRoomType)); 

router.patch('/update/', auth,[
    query('rsrtCode', 'Codigo de la Recinto Tipo es obligatorio').not().isEmpty(),
    fieldsValidator], updateRealStateRoomTypeSchema, awaitHandlerFactory(RealStateRoomTypeController.updateRealStateRoomType)); 

router.delete('/delete/', auth,[
    query('rsrtCode', 'Codigo de la Recinto Tipo es obligatorio').not().isEmpty(),
    fieldsValidator], deleteRealStateRoomTypeSchema, awaitHandlerFactory(RealStateRoomTypeController.deleteRealStateRoomType)); 

module.exports = router;