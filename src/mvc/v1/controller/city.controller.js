const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const city = require('../model/city.model');

const getAllCities = async( req, res, next ) => {

    try {
        const cities = await city.getAllCities();

        if(cities.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: cities.message,
                cities: cities.cities
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: cities.status,
                mensaje: cities.message
            });
        };
    } catch (error) {
        next();
    };
    
};
const getAllCitiesBibliographicCenter = async( req, res, next ) => {
    const orgCode = req.query.orgCode;
    try {
        const cities = await city.getAllCitiesBibliographicCenter(orgCode);

        if(cities.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: cities.message,
                cities: cities.cities
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: cities.status,
                mensaje: cities.message
            });
        };
    } catch (error) {
        next();
    };
    
};



const createCity = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {cityCode} = req.body;
        const cityExist = await city.cityExists( cityCode );
        
        if( cityExist.type === 'error' ){
            throw new HttpException(500, cityExist.message );
        };
        
        const result = await city.createCity(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Ciudad ha sido creada!'
        });
    } catch (error) {
        res.status(500).send({
            type: 'error',
            status: 500,
            message: error.message
        });
        next();
    };
};

const updateCity = async( req, res, next ) =>{

    const homologa = {

        'cityName'          :'city_name',
        'cityStatus'        :'city_status',  
    };

    checkValidation(req);

    const {city_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await city.updateCity(newRestOfUpdates[0], req.query.cityCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Ciudad Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Ciudad no se pudo actualizar'
        });
    };

};

const deleteCity = async (req, res, next) => {
    
    const cityCode = req.query.cityCode;

    const result = await city.deleteCity(cityCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Ciudad ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllCities,
    getAllCitiesBibliographicCenter,
    createCity,
    updateCity,
    deleteCity
};