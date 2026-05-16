const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ProgramTypeController = require('../../mvc/v1/controller/programType.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createProgramTypeSchema, deleteProgramTypeSchema, updateProgramTypeSchema } = require('../../middleware/validators/programTypeValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(ProgramTypeController.getAllProgramTypes)); 

router.get('/getOneById/', auth,[
    query('protCode', 'Codigo de la Tipo Programa es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ProgramTypeController.getProgramTypeById)); 

router.get('/getAllByName/', auth,[
    query('protName', 'Nombre de la Tipo Programa es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(ProgramTypeController.getAllProgramTypeByName)); 

router.post('/create/', auth, createProgramTypeSchema, awaitHandlerFactory(ProgramTypeController.createProgramType)); 

router.patch('/update/', auth,[
    query('protCode', 'Codigo de la Tipo Programa es obligatorio').not().isEmpty(),
    fieldsValidator], updateProgramTypeSchema, awaitHandlerFactory(ProgramTypeController.updateProgramType)); 

router.delete('/delete/', auth,[
    query('protCode', 'Codigo de la Tipo Programa es obligatorio').not().isEmpty(),
    fieldsValidator], deleteProgramTypeSchema, awaitHandlerFactory(ProgramTypeController.deleteProgramType)); 

module.exports = router;