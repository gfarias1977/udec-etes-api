const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const SchoolController = require('../../mvc/v1/controller/school.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createSchoolSchema, deleteSchoolSchema, updateSchoolSchema } = require('../../middleware/validators/schoolValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(SchoolController.getAllSchools)); 

router.get('/getOneById/', auth,[
    query('schoCode', 'Codigo de la Unidad Academica es obligatorio').not().isEmpty(),
    query('schoOrgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(SchoolController.getSchoolById)); 

router.get('/getAllByName/', auth,[
    query('schoDescription', 'Nombre de la Unidad Academica es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(SchoolController.getAllSchoolsByName)); 

router.get('/getAllByOrgCode/', auth,[
    query('schoOrgCode', 'Codigo Organizacion es obligatorio').not().isEmpty(),
    query('schoCaccCode', 'Codigo del Centro de Costo es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(SchoolController.getAllSchoolsByOrgCode)); 

router.post('/create/', auth, createSchoolSchema, awaitHandlerFactory(SchoolController.createSchool)); 

router.patch('/update/', auth,[
    query('schoCode', 'Codigo de la Unidad Academica es obligatorio').not().isEmpty(),
    query('schoOrgCode', 'Codigo de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator], updateSchoolSchema, awaitHandlerFactory(SchoolController.updateSchool)); 

router.delete('/delete/', auth,[
    query('schoCode', 'Codigo de la Unidad Academica es obligatorio').not().isEmpty(),
    fieldsValidator], deleteSchoolSchema, awaitHandlerFactory(SchoolController.deleteSchool)); 

module.exports = router; 