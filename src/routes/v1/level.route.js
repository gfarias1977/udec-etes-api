const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const LevelController = require('../../mvc/v1/controller/level.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createLevelSchema, deleteLevelSchema, updateLevelSchema } = require('../../middleware/validators/levelValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(LevelController.getAllLevels)); 

router.get('/getOneById/', auth,[
    query('levelCode', 'Codigo del Grado o Nivel Academico es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(LevelController.getLevelById)); 

router.get('/getAllByName/', auth,[
    query('levelDescription', 'Nombre del Grado o Nivel Academico es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(LevelController.getAllLevelsByName)); 

router.post('/create/', auth, createLevelSchema, awaitHandlerFactory(LevelController.createLevel)); 

router.patch('/update/', auth,[
    query('levelCode', 'Codigo del Grado o Nivel Academico es obligatorio').not().isEmpty(),
    fieldsValidator], updateLevelSchema, awaitHandlerFactory(LevelController.updateLevel)); 

router.delete('/delete/', auth,[
    query('levelCode', 'Codigo del Grado o Nivel Academico es obligatorio').not().isEmpty(),
    fieldsValidator], deleteLevelSchema, awaitHandlerFactory(LevelController.deleteLevel)); 

module.exports = router;