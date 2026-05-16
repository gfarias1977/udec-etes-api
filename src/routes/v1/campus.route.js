const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const CampusController = require('../../mvc/v1/controller/campus.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createCampusSchema, deleteCampusSchema, updateCampusSchema } = require('../../middleware/validators/campusValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(CampusController.getAllCampus)); 

router.post('/create/', auth, createCampusSchema, awaitHandlerFactory(CampusController.createCampus)); 

router.patch('/update/', auth,[
    query('campCode', 'Codigo del Campus es obligatorio').not().isEmpty(),
    fieldsValidator], updateCampusSchema, awaitHandlerFactory(CampusController.updateCampus)); 

router.delete('/delete/', auth,[
    query('campCode', 'Codigo del Campus es obligatorio').not().isEmpty(),
    fieldsValidator], deleteCampusSchema, awaitHandlerFactory(CampusController.deleteCampus)); 

module.exports = router;