const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const WorkTimeController = require('../../mvc/v1/controller/workTime.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createWorkTimeSchema, deleteWorkTimeSchema, updateWorkTimeSchema } = require('../../middleware/validators/workTimeValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(WorkTimeController.getAllWorkTimes)); 

router.get('/getOneById/', auth,[
    query('wktCode', 'Codigo de la Jornada es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(WorkTimeController.getWorkTimeById)); 

router.get('/getAllByName/', auth,[
    query('wktName', 'Nombre de la Jornada es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(WorkTimeController.getAllWorkTimesByName)); 

router.post('/create/', auth, createWorkTimeSchema, awaitHandlerFactory(WorkTimeController.createWorkTime)); 

router.patch('/update/', auth,[
    query('wktCode', 'Codigo de la Jornada es obligatorio').not().isEmpty(),
    fieldsValidator], updateWorkTimeSchema, awaitHandlerFactory(WorkTimeController.updateWorkTime)); 

router.delete('/delete/', auth,[
    query('wktCode', 'Codigo de la Jornada es obligatorio').not().isEmpty(),
    fieldsValidator], deleteWorkTimeSchema, awaitHandlerFactory(WorkTimeController.deleteWorkTime)); 

module.exports = router;