const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ActivityController = require('../../mvc/v1/controller/activity.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createActivitySchema, deleteActivitySchema, updateActivitySchema } = require('../../middleware/validators/activityValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(ActivityController.getAllActivities)); 

router.get('/getOneById/', auth,[
    query('actCode', 'Codigo de la Actividad es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ActivityController.getActivityById)); 

router.get('/getAllByName/', auth,[
    query('actName', 'Nombre de la Actividad es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ActivityController.getAllActivitiesByName)); 

router.post('/create/', auth, createActivitySchema, awaitHandlerFactory(ActivityController.createActivity)); 

router.patch('/update/', auth,[
    query('actCode', 'Codigo de la Actividad es obligatorio').not().isEmpty(),
    fieldsValidator], updateActivitySchema, awaitHandlerFactory(ActivityController.updateActivity)); 

router.delete('/delete/', auth,[
    query('actCode', 'Codigo de la Actividad es obligatorio').not().isEmpty(),
    fieldsValidator], deleteActivitySchema, awaitHandlerFactory(ActivityController.deleteActivity)); 

module.exports = router;