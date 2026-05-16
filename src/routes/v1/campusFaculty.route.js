const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const CampusFacultyController = require('../../mvc/v1/controller/campusFaculty.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createCampusFacultySchema, deleteCampusFacultySchema, updateCampusFacultySchema } = require('../../middleware/validators/campusFacultyValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(CampusFacultyController.getAllCampusFaculty)); 

router.get('/getOneById/', auth,[
    query('cfacFacuCode', 'Codigo de la Facultad  es obligatorio').not().isEmpty(),
    query('cfacCampCode', 'Codigo de la Sede  es obligatorio').not().isEmpty(),
    query('cfacOrgCode', 'Codigo de la Organizacion  es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(CampusFacultyController.getCampusFacultyById)); 

router.post('/create/', auth, createCampusFacultySchema, awaitHandlerFactory(CampusFacultyController.createCampusFaculty)); 

router.patch('/update/', auth,[
    query('cfacFacuCode', 'Codigo de la Facultad  es obligatorio').not().isEmpty(),
    query('cfacCampCode', 'Codigo de la Sede  es obligatorio').not().isEmpty(),
    query('cfacOrgCode', 'Codigo de la Organizacion  es obligatorio').not().isEmpty(),
    fieldsValidator], updateCampusFacultySchema, awaitHandlerFactory(CampusFacultyController.updateCampusFaculty)); 

router.delete('/delete/', auth,[
    query('cfacFacuCode', 'Codigo de la Facultad  es obligatorio').not().isEmpty(),
    query('cfacCampCode', 'Codigo de la Sede  es obligatorio').not().isEmpty(),
    query('cfacOrgCode', 'Codigo de la Organizacion  es obligatorio').not().isEmpty(),
    fieldsValidator], deleteCampusFacultySchema, awaitHandlerFactory(CampusFacultyController.deleteCampusFaculty)); 

module.exports = router;