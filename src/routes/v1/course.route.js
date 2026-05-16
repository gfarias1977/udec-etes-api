const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const CourseController = require('../../mvc/v1/controller/course.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createCourseSchema, deleteCourseSchema, updateCourseSchema } = require('../../middleware/validators/courseValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(CourseController.getAllCourses)); 

router.get('/getAllByOrgAndScholl/', auth,[
    //query('orgCode', 'Codigo de la Organización es obligatorio').not().isEmpty(),
    //query('schoCode', 'Codigo de la Unidad de Gestión es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(CourseController.getAllCoursesByOrgCodeAndSchoCode)); 

router.get('/getOneById/', auth,[
    query('coursCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(CourseController.getCourseById)); 

router.get('/getAllByName/', auth,[
    query('coursDescription', 'Nombre de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(CourseController.getAllCoursesByName)); 

router.post('/create/', auth, createCourseSchema, awaitHandlerFactory(CourseController.createCourse)); 

router.patch('/update/', auth,[
    query('coursCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator], updateCourseSchema, awaitHandlerFactory(CourseController.updateCourse)); 

router.delete('/delete/', auth,[
    query('coursCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator], deleteCourseSchema, awaitHandlerFactory(CourseController.deleteCourse)); 

module.exports = router;