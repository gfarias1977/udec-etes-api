const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const UserCampusModel = require('../model/userCampus.model');

const getAllUserCampus = async( req, res, next ) => {

    try {
        const userCampus = await UserCampusModel.getAllUserCampus();

        if(userCampus.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userCampus.message,
                userCampus: userCampus.userCampus
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userCampus.status,
                mensaje: userCampus.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getUserCampusById = async( req, res, next ) => {

    const usrcUserId = req.query.usrcUserId;
    const usrcCampCode = req.query.usrcCampCode;


    const userCampus = await UserCampusModel.getUserCampusById( usrcUserId, usrcCampCode );
    
    if(userCampus){
        res.status(200).send({
            type: 'ok',
            status: 200,
            userCampus: userCampus
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Usuarios-Sede no encontrado'
        });
    };

};


const getAllUserCampusByName = async( req, res, next ) => {

    const usrcName = req.query.usrcName;
    try {

        const userCampus = await UserCampusModel.getAllUserCampusByName( usrcName );

        if(userCampus.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userCampus.message,
                userCampus: userCampus.userCampus
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userCampus.status,
                mensaje: userCampus.message
            });
        };
    } catch (error) {
        next();
    };
};

const createUserCampus = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {usrcUserId, usrcCampCode} = req.body;
        const userCampusExist = await UserCampusModel.userCampusExist( usrcUserId, usrcCampCode);
        
        if( userCampusExist.type === 'error' ){
            throw new HttpException(500, userCampusExist.message );
        };
        
        const result = await UserCampusModel.createUserCampus(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Usuarios-Sede ha sido creado!'
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

const updateUserCampus = async( req, res, next ) =>{

    const homologa = {
        'usrcStatus' :'usrc_status',
    };

    checkValidation(req);

    const {usrc_status, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await UserCampusModel.updateUserCampus(newRestOfUpdates[0], req.query.usrcUserId, req.query.usrcCampCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Usuarios-Sede Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Usuarios-Sede no se pudo actualizar'
        });
    };

};

const deleteUserCampus = async (req, res, next) => {
    
    const usrcUserId=req.query.usrcUserId;
    const usrcCampCode=req.query.usrcCampCode;
    
    const result = await UserCampusModel.deleteUserCampus(usrcUserId,usrcCampCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Usuarios-Sede ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllUserCampus,
    getUserCampusById,
    getAllUserCampusByName,
    createUserCampus,
    updateUserCampus,
    deleteUserCampus
};