const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ProgramTypeModel = require('../model/programType.model');

const getAllProgramTypes = async( req, res, next ) => {

    try {
        const programTypes = await ProgramTypeModel.getAllProgramTypes();

        if(programTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: programTypes.message,
                programTypes: programTypes.programTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: programTypes.status,
                mensaje: programTypes.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getProgramTypeById = async( req, res, next ) => {

    const protCode = req.query.protCode;

    const programType = await ProgramTypeModel.getProgramTypeById( protCode );
    
    if(programType){
        res.status(200).send({
            type: 'ok',
            status: 200,
            programType: programType
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Tipo Programa no encontrada'
        });
    };

};


const getAllProgramTypeByName = async( req, res, next ) => {

    const protName = req.query.protName;
    try {

        const programTypes = await ProgramTypeModel.getAllProgamTypeByName( protName );

        if(programTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: programTypes.message,
                programTypes: programTypes.programTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: programTypes.status,
                mensaje: programTypes.message
            });
        };
    } catch (error) {
        next();
    };
};

const createProgramType = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {protCode} = req.body;
        const programTypeModelExist = await ProgramTypeModel.programTypeExist( protCode );
        
        if( programTypeModelExist.type === 'error' ){
            throw new HttpException(500, programTypeModelExist.message );
        };
        
        const result = await ProgramTypeModel.createProgramType(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Tipo de Programa ha sido creado!'
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

const updateProgramType = async( req, res, next ) =>{

    const homologa = {
        'protName'  : 'prot_name',
        'protStatus': 'prot_status'
    };

    checkValidation(req);

    const {prot_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ProgramTypeModel.updateProgramType(newRestOfUpdates[0], req.query.protCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Tipo de Programa Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Tipo de Programa no se pudo actualizar'
        });
    };

};

const deleteProgramType = async (req, res, next) => {
    
    const protCode = req.query.protCode;

    const result = await ProgramTypeModel.deleteProgramType(protCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Tipo de Programa ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllProgramTypes,
    getProgramTypeById,
    getAllProgramTypeByName,
    createProgramType,
    updateProgramType,
    deleteProgramType
};