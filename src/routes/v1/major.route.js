const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const MajorController = require('../../mvc/v1/controller/major.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createMajorSchema, deleteMajorSchema, updateMajorSchema } = require('../../middleware/validators/majorValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(MajorController.getAllMajors)); 

router.get('/getAllMajors/', auth,[
    fieldsValidator],awaitHandlerFactory(MajorController.getMajors)); 

router.get('/getOneById/', auth,[
    query('majorCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(MajorController.getMajorById)); 

router.get('/getAllByName/', auth,[
    query('majorDescription', 'Nombre de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(MajorController.getAllMajorsByName)); 

router.post('/create/', auth, createMajorSchema, awaitHandlerFactory(MajorController.createMajor)); 

router.patch('/update/', auth,[
    query('majorCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator], updateMajorSchema, awaitHandlerFactory(MajorController.updateMajor)); 

router.delete('/delete/', auth,[
    query('majorCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    fieldsValidator], deleteMajorSchema, awaitHandlerFactory(MajorController.deleteMajor)); 

module.exports = router;