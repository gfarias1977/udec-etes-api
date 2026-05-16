const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const FormatTypeController = require('../../mvc/v1/controller/formatType.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createFormatTypeSchema, deleteFormatTypeSchema, updateFormatTypeSchema } = require('../../middleware/validators/formatTypeValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(FormatTypeController.getAllFormatTypes)); 

router.post('/create/', auth, createFormatTypeSchema, awaitHandlerFactory(FormatTypeController.createFormatType)); 

router.patch('/update/', auth,[
    query('fmtId', 'Id del Formato es obligatorio').not().isEmpty(),
    fieldsValidator], updateFormatTypeSchema, awaitHandlerFactory(FormatTypeController.updateFormatType)); 

router.delete('/delete/', auth,[
    query('fmtId', 'Id del Formato es obligatorio').not().isEmpty(),
    fieldsValidator], deleteFormatTypeSchema, awaitHandlerFactory(FormatTypeController.deleteFormatType)); 

module.exports = router;