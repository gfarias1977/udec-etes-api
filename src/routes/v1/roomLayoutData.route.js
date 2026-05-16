const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const RoomLayoutDataController = require('../../mvc/v1/controller/roomLayoutData.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createRoomLayoutDataSchema, deleteRoomLayoutDataSchema, updateRoomLayoutDataSchema } = require('../../middleware/validators/roomLayoutDataValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(RoomLayoutDataController.getAllRoomLayoutData)); 

router.get('/getOneById/', auth,[
    query('rladLaydCode', 'Codigo del Tipo de Layout es obligatorio').not().isEmpty(),
    query('rladRlayCode', 'Codigo del Recinto es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RoomLayoutDataController.getRoomLayoutDataById)); 

router.get('/getAllByName/', auth,[
        query('rladDescription', 'Nombre es obligatorio').not().isEmpty(),
        fieldsValidator],awaitHandlerFactory(RoomLayoutDataController.getAllRoomLayoutDataByName)); 
            

router.post('/create/', auth, createRoomLayoutDataSchema, awaitHandlerFactory(RoomLayoutDataController.createRoomLayoutData)); 

router.patch('/update/', auth,[
    query('rladLaydCode', 'Codigo del Tipo de Layout es obligatorio').not().isEmpty(),
    query('rladRlayCode', 'Codigo del Recinto es obligatorio').not().isEmpty(),
    fieldsValidator], updateRoomLayoutDataSchema, awaitHandlerFactory(RoomLayoutDataController.updateRoomLayoutData)); 

router.delete('/delete/', auth,[
    query('rladLaydCode', 'Codigo del Tipo de Layout es obligatorio').not().isEmpty(),
    query('rladRlayCode', 'Codigo del Recinto es obligatorio').not().isEmpty(),
    fieldsValidator], deleteRoomLayoutDataSchema, awaitHandlerFactory(RoomLayoutDataController.deleteRoomLayoutData)); 

module.exports = router;