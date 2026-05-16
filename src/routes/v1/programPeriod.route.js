const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ProgramPeriodController = require('../../mvc/v1/controller/programPeriod.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createProgramPeriodSchema, deleteProgramPeriodSchema, updateProgramPeriodSchema } = require('../../middleware/validators/programPeriodValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(ProgramPeriodController.getAllProgramPeriods)); 

router.get('/getOneById/', auth,[
    query('propCode', 'Codigo de la Periodo Programa es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ProgramPeriodController.getProgramPeriodById)); 

router.get('/getAllByName/', auth,[
    query('propName', 'Nombre de la Periodo Programa es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ProgramPeriodController.getAllProgramPeriodByName)); 

router.post('/create/', auth, createProgramPeriodSchema, awaitHandlerFactory(ProgramPeriodController.createProgramPeriod)); 

router.patch('/update/', auth,[
    query('propCode', 'Codigo de la Periodo Programa es obligatorio').not().isEmpty(),
    fieldsValidator], updateProgramPeriodSchema, awaitHandlerFactory(ProgramPeriodController.updateProgramPeriod)); 

router.delete('/delete/', auth,[
    query('propCode', 'Codigo de la Periodo Programa es obligatorio').not().isEmpty(),
    fieldsValidator], deleteProgramPeriodSchema, awaitHandlerFactory(ProgramPeriodController.deleteProgramPeriod)); 

module.exports = router;