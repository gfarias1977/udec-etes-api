const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const FacultyController = require('../../mvc/v1/controller/faculty.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createFacultySchema, deleteFacultySchema, updateFacultySchema } = require('../../middleware/validators/facultyValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(FacultyController.getAllFaculties)); 

router.get('/getOneById/', auth,[
    query('facuCode', 'Codigo de la Facultad es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(FacultyController.getFacultyById)); 

router.get('/getAllByName/', auth,[
    query('facuName', 'Nombre de la Facultaad es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(FacultyController.getAllFacultysByName)); 

router.post('/create/', auth, createFacultySchema, awaitHandlerFactory(FacultyController.createFaculty)); 

router.patch('/update/', auth,[
    query('facuCode', 'Codigo de la Facultad es obligatorio').not().isEmpty(),
    fieldsValidator], updateFacultySchema, awaitHandlerFactory(FacultyController.updateFaculty)); 

router.delete('/delete/', auth,[
    query('facuCode', 'Codigo de la Facultad es obligatorio').not().isEmpty(),
    fieldsValidator], deleteFacultySchema, awaitHandlerFactory(FacultyController.deleteFaculty)); 

module.exports = router;