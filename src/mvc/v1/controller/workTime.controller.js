const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const WorkTimeModel = require('../model/workTime.model');

const getAllWorkTimes = async( req, res, next ) => {

    try {
        const workTimes = await WorkTimeModel.getAllWorkTimes();

        if(workTimes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: workTimes.message,
                workTimes: workTimes.workTimes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: workTimes.status,
                mensaje: workTimes.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getWorkTimeById = async( req, res, next ) => {

    const wktCode = req.query.wktCode;

    const workTime = await WorkTimeModel.getWorkTimeById( wktCode );
    
    if(workTime){
        res.status(200).send({
            type: 'ok',
            status: 200,
            workTime: workTime
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Jornada no encontrada'
        });
    };

};


const getAllWorkTimesByName = async( req, res, next ) => {

    const wktName = req.query.wktName;
    try {

        const workTimes = await WorkTimeModel.getAllWorkTimeByName( wktName );

        if(workTimes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: workTimes.message,
                workTimes: workTimes.workTimes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: workTimes.status,
                mensaje: workTimes.message
            });
        };
    } catch (error) {
        next();
    };
};

const createWorkTime = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {wktCode} = req.body;
        const workTimeExist = await WorkTimeModel.workTimeExist( wktCode );
        
        if( workTimeExist.type === 'error' ){
            throw new HttpException(500, workTimeExist.message );
        };
        
        const result = await WorkTimeModel.createWorkTime(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Jornada ha sido creada!'
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

const updateWorkTime = async( req, res, next ) =>{

    const homologa = {
        'wktName'        :'wkt_name',
        'wktStatus'      :'wkt_status'  
    };

    checkValidation(req);

    const {wkt_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await WorkTimeModel.updateWorkTime(newRestOfUpdates[0], req.query.wktCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Jornada Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Jornada no se pudo actualizar'
        });
    };

};

const deleteWorkTime = async (req, res, next) => {
    
    const wktCode = req.query.wktCode;

    const result = await WorkTimeModel.deleteWorkTime(wktCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Jornada ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllWorkTimes,
    getWorkTimeById,
    getAllWorkTimesByName,
    createWorkTime,
    updateWorkTime,
    deleteWorkTime
};