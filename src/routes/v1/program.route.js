const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ProgramController = require('../../mvc/v1/controller/program.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createProgramSchema, deleteProgramSchema, updateProgramSchema } = require('../../middleware/validators/programValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(ProgramController.getAllPrograms)); 

router.get('/getOneById/', auth,[
    query('progCode', 'Codigo del Plan es obligatorio').not().isEmpty(),
    query('progMajorCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ProgramController.getProgramById)); 

router.get('/getAllByName/', auth,[
    query('progName', 'Nombre del Plan es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ProgramController.getAllProgramsByName)); 

router.post('/create/', auth, createProgramSchema, awaitHandlerFactory(ProgramController.createProgram)); 

router.patch('/update/', auth,[
    query('progCode', 'Codigo del Plan es obligatorio').not().isEmpty(),
    query('progMajorCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator], updateProgramSchema, awaitHandlerFactory(ProgramController.updateProgram)); 

router.delete('/delete/', auth,[
    query('progCode', 'Codigo del Plan es obligatorio').not().isEmpty(),
    fieldsValidator], deleteProgramSchema, awaitHandlerFactory(ProgramController.deleteProgram)); 

module.exports = router;