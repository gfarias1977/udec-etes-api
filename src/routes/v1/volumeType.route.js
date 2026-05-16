const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const VolumeTypeController = require('../../mvc/v1/controller/volumeType.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createVolumeTypeSchema, deleteVolumeTypeSchema, updateVolumeTypeSchema } = require('../../middleware/validators/volumeTypeValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(VolumeTypeController.getAllVolumeTypes)); 

router.post('/create/', auth, createVolumeTypeSchema, awaitHandlerFactory(VolumeTypeController.createVolumeType)); 

router.patch('/update/', auth,[
    query('vlmId', 'Id del Formato es obligatorio').not().isEmpty(),
    fieldsValidator], updateVolumeTypeSchema, awaitHandlerFactory(VolumeTypeController.updateVolumeType)); 

router.delete('/delete/', auth,[
    query('vlmId', 'Id del Formato es obligatorio').not().isEmpty(),
    fieldsValidator], deleteVolumeTypeSchema, awaitHandlerFactory(VolumeTypeController.deleteVolumeType)); 

module.exports = router;