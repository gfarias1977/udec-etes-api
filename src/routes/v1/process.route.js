const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ProcessController = require('../../mvc/v1/controller/process.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createProcessSchema, deleteProcessSchema, updateProcessSchema } = require('../../middleware/validators/processValidator.middleware');

router.get('/getAll/', auth,[
    query('proctId', 'Codigo de la fuente es obligatorio').not().isEmpty(),
    query('purcCode', 'Codigo de la Area de Gestion es Obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ProcessController.getAllProcessByPurcCode)); 

router.post('/create/', auth, createProcessSchema, awaitHandlerFactory(ProcessController.createProcess)); 

router.patch('/update/', auth,[
    query('procId', 'Codigo del Proceso es obligatorio').not().isEmpty(),
    fieldsValidator], updateProcessSchema, awaitHandlerFactory(ProcessController.updateProcess)); 

router.delete('/delete/', auth,[
    query('procId', 'Codigo del Proceso es obligatorio').not().isEmpty(),
    fieldsValidator], deleteProcessSchema, awaitHandlerFactory(ProcessController.deleteProcess)); 

module.exports = router;