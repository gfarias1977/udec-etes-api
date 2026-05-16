const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const UserPurchaseAreaModel = require('../model/userPurchaseArea.model');

const getAllUserPurchaseAreas = async( req, res, next ) => {

    try {
        const userPurchaseAreas = await UserPurchaseAreaModel.getAllUserPurchaseAreas();

        if(userPurchaseAreas.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userPurchaseAreas.message,
                userPurchaseAreas: userPurchaseAreas.userPurchaseAreas
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userPurchaseAreas.status,
                mensaje: userPurchaseAreas.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getUserPurchaseAreaById = async( req, res, next ) => {

    const uspaUserId = req.query.uspaUserId;
    const uspaPurcCode = req.query.uspaPurcCode;


    const userPurchaseArea = await UserPurchaseAreaModel.getUserPurchaseAreaById( uspaUserId, uspaPurcCode );
    
    if(userPurchaseArea){
        res.status(200).send({
            type: 'ok',
            status: 200,
            userPurchaseArea: userPurchaseArea
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Usuarios Area de Gestión no encontrado'
        });
    };

};

const getUserPurchaseAreasByUserId = async( req, res, next ) => {

    const { filterOptions, searchTerm } = req.query;
    const uspaUserId = req.query.uspaUserId;
    try {   

        const userPurchaseAreas = await UserPurchaseAreaModel.getUserPurchaseAreasByUserId( uspaUserId );

        if(userPurchaseAreas.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredUserPurchaseAreas = userPurchaseAreas.userPurchaseAreas;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredUserPurchaseAreas = filteredUserPurchaseAreas.filter(
                    purchaseAreas => purchaseAreas.uspaPurcCode.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(purchaseAreas.uspaAsigned)
                          || purchaseAreas.uspaPurcName.toLowerCase().includes(searchTerm.toLowerCase()));
                } else if (searchTerm) {
                    filteredUserPurchaseAreas = filteredUserPurchaseAreas.filter(purchaseAreas => roles.uspaPurcCode.toLowerCase().includes(searchTerm.toLowerCase())
                                                            || purchaseAreas.uspaPurcName.toLowerCase().includes(searchTerm.toLowerCase()) );
                } else {
                    filteredUserPurchaseAreas = filteredUserPurchaseAreas.filter(purchaseAreas => filterOptions.includes(purchaseAreas.uspaAsigned));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userPurchaseAreas.message,
                userPurchaseAreas: filteredUserPurchaseAreas//userRoles.userRoles
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userPurchaseAreas.status,
                mensaje: userPurchaseAreas.message
            });
        };
    } catch (error) {
        next();
    };

};

const getUserPurchaseAreaByUserName = async( req, res, next ) => {

    const uspaUserName = req.query.uspaUserName;
    const uspaPurcCode = req.query.uspaPurcCode;


    const userPurchaseArea = await UserPurchaseAreaModel.getUserPurchaseAreaByUserName( uspaUserName, uspaPurcCode );
    
    if(userPurchaseArea){
        res.status(200).send({
            type: 'ok',
            status: 200,
            userPurchaseArea: userPurchaseArea
        })
    }else{
        res.status(200).send({
            type: 'ok',
            status: 200,
            mensaje: 'Usuarios Area de Gestión no encontrado'
        });
    };

};


const getAllUserPurchaseAreaByName = async( req, res, next ) => {

    const uspaName = req.query.uspaName;
    try {

        const userPurchaseAreas = await UserPurchaseAreaModel.getAllUserPurchaseAreaByName( uspaName );

        if(userPurchaseAreas.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userPurchaseAreas.message,
                userPurchaseAreas: userPurchaseAreas.userPurchaseAreas
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userPurchaseAreas.status,
                mensaje: userPurchaseAreas.message
            });
        };
    } catch (error) {
        next();
    };
};

const createUserPurchaseArea = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {uspaUserId, uspaPurcCode} = req.body;
        const userPurchaseAreaExist = await UserPurchaseAreaModel.UserPurchaseAreaExist( uspaUserId, uspaPurcCode);
        
        if( userPurchaseAreaExist.type === 'error' ){
            throw new HttpException(500, userPurchaseAreaExist.message );
        };
        
        const result = await UserPurchaseAreaModel.createUserPurchaseArea(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Usuarios Area de Gestión ha sido creado!'
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

const createUserPurchaseAreas = async (req, res, next) => {
    checkValidation(req);

    try {
       const {userPurchaseAreas} = req.body;

       const userPurchaseAreasDeleteResult = await UserPurchaseAreaModel.deleteUserPurchaseAreaByUserId( userPurchaseAreas[0].uspaUserId);
       //if (!userPurchaseAreasDeleteResult) {
        //throw new HttpException(500, 'Error interno del servidor');
       //}else{
            for (i=0; i < userPurchaseAreas.length; i++) {
                    if (userPurchaseAreas[i].uspaSelected === 'S'){
                        const result = await UserPurchaseAreaModel.createUserPurchaseArea(userPurchaseAreas[i]);
                        if (!result || result.type === 'error') {
                            //throw new HttpException(500, 'Error interno del servidor');
                        };  
                    };
            }
      //}      


       res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Usuarios Areas de Gestión han sido creados!'
    }); 

    } catch (error) {
        res.status(500).send({
            type: 'error',
            status: 500,
            message: error.message
        });
       //next();
    };
};

const updateUserPurchaseArea = async( req, res, next ) =>{

    const homologa = {
        'uspaStatus' :'uspa_status',
    };

    checkValidation(req);

    const {uspa_status, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await UserPurchaseAreaModel.updateUserPurchaseArea(newRestOfUpdates[0], req.query.uspaUserId, req.query.uspaPurcCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Usuarios Area de Gestión Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Usuarios Area de Gestión no se pudo actualizar'
        });
    };

};

const deleteUserPurchaseArea = async (req, res, next) => {
    
    const uspaUserId=req.query.uspaUserId;
    const uspaPurcCode=req.query.uspaPurcCode;
    
    const result = await UserPurchaseAreaModel.deleteUserPurchaseArea(uspaUserId,uspaPurcCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Usuario Area de Gestión ha sido eliminado!'
    });
};

const deleteUserPurchaseAreasByUserId = async (req, res, next) => {
    
    const uspaUserId=req.query.uspaUserId;
    
    const result = await UserPurchaseAreaModel.deleteUserPurchaseAreaByUserId(uspaUserId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Usuario Area de Gestión ha sido eliminado!'
    });
};


checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllUserPurchaseAreas,
    getUserPurchaseAreaById,
    getUserPurchaseAreasByUserId,
    getUserPurchaseAreaByUserName,
    getAllUserPurchaseAreaByName,
    createUserPurchaseArea,
    createUserPurchaseAreas,
    updateUserPurchaseArea,
    deleteUserPurchaseArea,
    deleteUserPurchaseAreasByUserId
};