const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const CampusFacultyModel = require('../model/campusFaculty.model');

const getAllCampusFaculty = async( req, res, next ) => {

    try {
        const campusFaculty = await CampusFacultyModel.getAllCampusFaculty();

        if(campusFaculty.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: campusFaculty.message,
                campusFaculty: campusFaculty.campusFaculty
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: campusFaculty.status,
                mensaje: campusFaculty.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getCampusFacultyById = async( req, res, next ) => {

    const cfacFacuCode = req.query.cfacFacuCode;
    const cfacCampCode = req.query.cfacCampCode;
    const cfacOrgCode  = req.query.cfacOrgCode;

    const campusFaculty = await CampusFacultyModel.getCampusFacultyById( cfacFacuCode, cfacCampCode, cfacOrgCode );
    
    if(campusFaculty){
        res.status(200).send({
            type: 'ok',
            status: 200,
            campusFaculty: campusFaculty
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Sede Facultad no encontrada'
        });
    };

};


const createCampusFaculty = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const { cfacFacuCode, cfacCampCode, cfacOrgCode } = req.body;
        const campusFacultyExist = await CampusFacultyModel.campusFacultyExists(  cfacFacuCode, cfacCampCode, cfacOrgCode );
        
        if( campusFacultyExist.type === 'error' ){
            throw new HttpException(500, campusFacultyExist.message );
        };
        
        const result = await CampusFacultyModel.createCampusFaculty(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Sede Facultad ha sido creado!'
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

const updateCampusFaculty = async( req, res, next ) =>{

    const homologa = {
        'cfacStatus'        : 'cfac_status'
    };

    checkValidation(req);

    const {cfac_status, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await CampusFacultyModel.updateCampusFaculty(newRestOfUpdates[0], req.query.cfacFacuCode, req.query.cfacCampCode, req.query.cfacOrgCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Sede Facultad Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Sede Facultad no se pudo actualizar'
        });
    };

};

const deleteCampusFaculty = async (req, res, next) => {
    
    const cfacFacuCode = req.query.cfacFacuCode;
    const cfacCampCode = req.query.cfacCampCode;
    const cfacOrgCode  = req.query.cfacOrgCode;

    const result = await CampusFacultyModel.deleteCampusFaculty(cfacFacuCode, cfacCampCode, cfacOrgCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Sede Facultad ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllCampusFaculty,
    getCampusFacultyById,
    createCampusFaculty,
    updateCampusFaculty,
    deleteCampusFaculty
};