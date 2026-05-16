const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const UserCampusController = require('../../mvc/v1/controller/userCampus.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createUserCampusSchema, deleteUserCampusSchema, updateUserCampusSchema } = require('../../middleware/validators/userCampusValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(UserCampusController.getAllUserCampus)); 

router.get('/getOneById/', auth,[
    query('usrcUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('usrcCampCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(UserCampusController.getUserCampusById)); 

router.get('/getAllByName/', auth,[
        query('usrcName', 'Nombre es obligatorio').not().isEmpty(),
        fieldsValidator],awaitHandlerFactory(UserCampusController.getAllUserCampusByName)); 
            

router.post('/create/', auth, createUserCampusSchema, awaitHandlerFactory(UserCampusController.createUserCampus)); 

router.patch('/update/', auth,[
    query('usrcUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('usrcCampCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
    fieldsValidator], updateUserCampusSchema, awaitHandlerFactory(UserCampusController.updateUserCampus)); 

router.delete('/delete/', auth,[
    query('usrcUserId', 'Codigo del Usuario es obligatorio').not().isEmpty(),
    query('usrcCampCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
    fieldsValidator], deleteUserCampusSchema, awaitHandlerFactory(UserCampusController.deleteUserCampus)); 

module.exports = router;