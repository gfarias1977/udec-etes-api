const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const CityController = require('../../mvc/v1/controller/city.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createCitySchema, deleteCitySchema, updateCitySchema } = require('../../middleware/validators/cityValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(CityController.getAllCities)); 

router.get('/getAllCitiesBibliographicCenter/', auth,[
    //query('orgCode', 'Id de la Organizacion es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(CityController.getAllCitiesBibliographicCenter));     

router.post('/create/', auth, createCitySchema, awaitHandlerFactory(CityController.createCity)); 

router.patch('/update/', auth,[
    query('cityCode', 'Id del Formato es obligatorio').not().isEmpty(),
    fieldsValidator], updateCitySchema, awaitHandlerFactory(CityController.updateCity)); 

router.delete('/delete/', auth,[
    query('cityCode', 'Id del Formato es obligatorio').not().isEmpty(),
    fieldsValidator], deleteCitySchema, awaitHandlerFactory(CityController.deleteCity)); 

module.exports = router;