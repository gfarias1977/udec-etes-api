const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const UserBusinessUnitModel = require('../model/userBusinessUnit.model');

const getAllUserBusinessUnits = async( req, res, next ) => {

    try {
        const userBusinessUnits = await UserBusinessUnitModel.getAllUserBusinessUnits();

        if(userBusinessUnits.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userBusinessUnits.message,
                userBusinessUnits: userBusinessUnits.userBusinessUnits
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userBusinessUnits.status,
                mensaje: userBusinessUnits.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getUserBusinessUnitById = async( req, res, next ) => {

    const usbuUserId = req.query.usbuUserId;
    const usbuBuCode = req.query.usbuBuCode;


    const userBusinessUnit = await UserBusinessUnitModel.getUserBusinessUnitById( usbuUserId, usbuBuCode );
    
    if(userBusinessUnit){
        res.status(200).send({
            type: 'ok',
            status: 200,
            userBusinessUnit: userBusinessUnit
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Usuarios Unidad de Negocio no encontrado'
        });
    };

};

const getAllBusinessUnitsByUserId = async( req, res, next ) => {

    const { filterOptions, searchTerm } = req.query;
    const usbuUserId = req.query.usbuUserId;
    try {   

        const userBusinessUnits = await UserBusinessUnitModel.getAllBusinessUnitsByUserId( usbuUserId );

        if(userBusinessUnits.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredUserBusinessUnits = userBusinessUnits.userBusinessUnits;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredUserBusinessUnits = filteredUserBusinessUnits.filter(
                    businessUnits => businessUnits.usbuName.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(businessUnits.usbuAsigned)
                          );
                } else if (searchTerm) {
                    filteredUserBusinessUnits = filteredUserBusinessUnits.filter(businessUnits => businessUnits.usbuName.toLowerCase().includes(searchTerm.toLowerCase())
                                                            );
                } else {
                    filteredUserBusinessUnits = filteredUserBusinessUnits.filter(businessUnits => filterOptions.includes(businessUnits.usbuAsigned));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userBusinessUnits.message,
                userBusinessUnits: filteredUserBusinessUnits//userRoles.userRoles
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userBusinessUnits.status,
                mensaje: userBusinessUnits.message
            });
        };
    } catch (error) {
        next();
    };

};

const getUserBusinessUnitByUserName = async( req, res, next ) => {

    const usbuUserName = req.query.usbuUserName;
    const usbuBuCode = req.query.usbuBuCode;


    const userBusinessUnit = await UserBusinessUnitModel.getUserBusinessUnitByUserName( usbuUserName, usbuBuCode );
    
    if(userBusinessUnit){
        res.status(200).send({
            type: 'ok',
            status: 200,
            userBusinessUnit: userBusinessUnit
        })
    }else{
        res.status(200).send({
            type: 'ok',
            status: 200,
            mensaje: 'Usuarios Unidad de Negocio no encontrado'
        });
    };

};


const getAllUserBusinessUnitByName = async( req, res, next ) => {

    const usrcName = req.query.usrcName;
    try {

        const userBusinessUnits = await UserBusinessUnitModel.getAllUserBusinessUnitByName( usrcName );

        if(userBusinessUnits.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userBusinessUnits.message,
                userBusinessUnits: userBusinessUnits.userBusinessUnits
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userBusinessUnits.status,
                mensaje: userBusinessUnits.message
            });
        };
    } catch (error) {
        next();
    };
};

const createUserBusinessUnit = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {usbuUserId, usbuBuCode} = req.body;
        const UserBusinessUnitExist = await UserBusinessUnitModel.UserBusinessUnitExist( usbuUserId, usbuBuCode);
        
        if( UserBusinessUnitExist.type === 'error' ){
            throw new HttpException(500, UserBusinessUnitExist.message );
        };
        
        const result = await UserBusinessUnitModel.createUserBusinessUnit(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Usuarios Unidad de Negocio ha sido creado!'
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

const createUserBusinessUnits = async (req, res, next) => {
    checkValidation(req);

    try {
       const {userBusinessUnits} = req.body;

       const userBusinessUnitsDeleteResult = await UserBusinessUnitModel.deleteUserBusinessUnitsByUserId( userBusinessUnits[0].usbuUserId);
      // if (!userRolesDeleteResult) {
        //throw new HttpException(500, 'Error interno del servidor');
      // }else{
            for (i=0; i < userBusinessUnits.length; i++) {
                    if (userBusinessUnits[i].usbuSelected === 'S'){
                        const result = await UserBusinessUnitModel.createUserBusinessUnit(userBusinessUnits[i]);
                        if (!result || result.type === 'error') {
                            //throw new HttpException(500, 'Error interno del servidor');
                        };  
                    };
            }
      // }      


       res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Usuarios Unidades de Negocio han sido creados!'
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

const updateUserBusinessUnit = async( req, res, next ) =>{

    const homologa = {
        'usbuStatus' :'usbu_status',
    };

    checkValidation(req);

    const {usbu_status, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await UserBusinessUnitModel.updateUserBusinessUnit(newRestOfUpdates[0], req.query.usbuUserId, req.query.usbuBuCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Usuarios Unidad de Negocio Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Usuarios Unidad de Negocio no se pudo actualizar'
        });
    };

};

const deleteUserBusinessUnit = async (req, res, next) => {
    
    const usbuUserId=req.query.usbuUserId;
    const usbuBuCode=req.query.usbuBuCode;
    
    const result = await UserBusinessUnitModel.deleteUserBusinessUnit(usbuUserId,usbuBuCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Usuarios Unidad de Negocio ha sido eliminado!'
    });
};

const deleteUserBusinessUnitsByUserId = async (req, res, next) => {
    
    const usbuUserId=req.query.usbuUserId;
    
    const result = await UserBusinessUnitModel.deleteUserBusinessUnitsByUserId(usbuUserId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Usuario Unidad de Negocio ha sido eliminado!'
    });
};


checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllUserBusinessUnits,
    getUserBusinessUnitById,
    getAllBusinessUnitsByUserId,
    getUserBusinessUnitByUserName,
    getAllUserBusinessUnitByName,
    createUserBusinessUnit,
    createUserBusinessUnits,
    updateUserBusinessUnit,
    deleteUserBusinessUnit,
    deleteUserBusinessUnitsByUserId,
};