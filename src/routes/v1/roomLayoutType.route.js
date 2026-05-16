const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const RoomLayoutTypeController = require('../../mvc/v1/controller/roomLayoutType.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createRoomLayoutTypeSchema, deleteRoomLayoutTypeSchema, updateRoomLayoutTypeSchema } = require('../../middleware/validators/roomLayoutTypeValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(RoomLayoutTypeController.getAllRoomLayoutTypes)); 

router.get('/getOneById/', auth,[
    query('rlatCode', 'Codigo del Recinto Tipo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RoomLayoutTypeController.getRoomLayoutTypeById)); 

router.get('/getAllByName/', auth,[
    query('rlatDescription', 'Nombre del Recinto Tipo Academico es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RoomLayoutTypeController.getAllRoomLayoutTypesByName)); 

router.post('/create/', auth, createRoomLayoutTypeSchema, awaitHandlerFactory(RoomLayoutTypeController.createRoomLayoutType)); 

router.patch('/update/', auth,[
    query('rlatCode', 'Codigo del Recinto Tipo es obligatorio').not().isEmpty(),
    fieldsValidator], updateRoomLayoutTypeSchema, awaitHandlerFactory(RoomLayoutTypeController.updateRoomLayoutType)); 

router.delete('/delete/', auth,[
    query('rlatCode', 'Codigo del Recinto Tipo es obligatorio').not().isEmpty(),
    fieldsValidator], deleteRoomLayoutTypeSchema, awaitHandlerFactory(RoomLayoutTypeController.deleteRoomLayoutType)); 

module.exports = router;