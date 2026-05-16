const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const RoomLayout = require('../../mvc/v1/controller/roomLayout.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createRoomLayoutSchema, deleteRoomLayoutSchema, updateRoomLayoutSchema } = require('../../middleware/validators/roomLayoutValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(RoomLayout.getAllRoomLayouts)); 

router.get('/getAllByPurcCode/', auth,[
    query('purcCode', 'Codigo del Area de Gestion es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RoomLayout.getAllRoomLayoutsByPurcCode)); 


router.get('/getOneById/', auth,[
    query('rlayCode', 'Codigo del Recinto Prototipo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RoomLayout.getRoomLayoutById)); 

router.get('/getAllByName/', auth,[
    query('rlayDescription', 'Nombre del Recinto Prototipo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RoomLayout.getAllRoomLayoutsByName)); 

router.get('/getAllByParameters/', auth,[
    query('purcCode', 'Código de Area de Gestión es obligatorio').not().isEmpty(),
    query('buCode', 'Código de Unidad de Negocio es obligatorio').not().isEmpty(),
    //query('orgCode', 'Código de Institución es obligatorio').not().isEmpty(),
    //query('stdCode', 'Código de Estandard es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(RoomLayout.getAllRoomLayoutsByParameters));     

router.post('/create/', auth, createRoomLayoutSchema, awaitHandlerFactory(RoomLayout.createRoomLayout)); 

router.patch('/update/', auth,[
    query('rlayCode', 'Codigo del Recinto Prototipo es obligatorio').not().isEmpty(),
    fieldsValidator], updateRoomLayoutSchema, awaitHandlerFactory(RoomLayout.updateRoomLayout)); 

router.delete('/delete/', auth,[
    query('rlayCode', 'Codigo del Recinto Prototipo es obligatorio').not().isEmpty(),
    fieldsValidator], deleteRoomLayoutSchema, awaitHandlerFactory(RoomLayout.deleteRoomLayout)); 

module.exports = router;