const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ProgramPeriodModel = require('../model/programPeriod.model');

const getAllProgramPeriods = async( req, res, next ) => {

    try {
        const programPeriods = await ProgramPeriodModel.getAllProgramPeriods();

        if(programPeriods.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: programPeriods.message,
                programPeriods: programPeriods.programPeriods
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: programPeriods.status,
                mensaje: programPeriods.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getProgramPeriodById = async( req, res, next ) => {

    const propCode = req.query.propCode;

    const programPeriod = await ProgramPeriodModel.getProgramPeriodById( propCode );
    
    if(programPeriod){
        res.status(200).send({
            type: 'ok',
            status: 200,
            programPeriod: programPeriod
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Periodo Programa no encontrada'
        });
    };

};


const getAllProgramPeriodByName = async( req, res, next ) => {

    const propName = req.query.propName;
    try {

        const programPeriods = await ProgramPeriodModel.getAllProgamTypeByName( propName );

        if(programPeriods.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: programPeriods.message,
                programPeriods: programPeriods.programPeriods
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: programPeriods.status,
                mensaje: programPeriods.message
            });
        };
    } catch (error) {
        next();
    };
};

const createProgramPeriod = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {propCode} = req.body;
        const programPeriodModelExist = await ProgramPeriodModel.programPeriodExist( propCode );
        
        if( programPeriodModelExist.type === 'error' ){
            throw new HttpException(500, programPeriodModelExist.message );
        };
        
        const result = await ProgramPeriodModel.createProgramPeriod(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Periodo de Programa ha sido creado!'
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

const updateProgramPeriod = async( req, res, next ) =>{

    const homologa = {
        'propName'  : 'prop_name',
        'propStatus': 'prop_status'
    };

    checkValidation(req);

    const {prop_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ProgramPeriodModel.updateProgramPeriod(newRestOfUpdates[0], req.query.propCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Periodo de Programa Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Periodo de Programa no se pudo actualizar'
        });
    };

};

const deleteProgramPeriod = async (req, res, next) => {
    
    const propCode = req.query.propCode;

    const result = await ProgramPeriodModel.deleteProgramPeriod(propCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Periodo de Programa ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllProgramPeriods,
    getProgramPeriodById,
    getAllProgramPeriodByName,
    createProgramPeriod,
    updateProgramPeriod,
    deleteProgramPeriod
};