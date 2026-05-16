const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const UserRoleModel = require('../model/userRole.model');

const getAllUserRoles = async( req, res, next ) => {

    try {
        const userRoles = await UserRoleModel.getAllUserRoles();

        if(userRoles.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userRoles.message,
                userRoles: userRoles.userRoles
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userRoles.status,
                mensaje: userRoles.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getUserRolesById = async( req, res, next ) => {

    const { filterOptions, searchTerm } = req.query;
    const usroUserId = req.query.usroUserId;
    try {   

        const userRoles = await UserRoleModel.getUserRolesById( usroUserId );

        if(userRoles.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredUserRoles = userRoles.userRoles;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredUserRoles = filteredUserRoles.filter(
                    roles => roles.usroRoleName.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(roles.usroAsigned)
                          || roles.usroRoleDescription.toLowerCase().includes(searchTerm.toLowerCase()));
                } else if (searchTerm) {
                    filteredUserRoles = filteredUserRoles.filter(roles => roles.usroRoleName.toLowerCase().includes(searchTerm.toLowerCase())
                                                            || roles.usroRoleDescription.toLowerCase().includes(searchTerm.toLowerCase()) );
                } else {
                    filteredUserRoles = filteredUserRoles.filter(roles => filterOptions.includes(roles.usroAsigned));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userRoles.message,
                userRoles: filteredUserRoles//userRoles.userRoles
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userRoles.status,
                mensaje: userRoles.message
            });
        };
    } catch (error) {
        next();
    };

};


const getAllUserRoleByName = async( req, res, next ) => {

    const usroName = req.query.usroName;
    try {

        const userRoles = await UserRoleModel.getAllUserRoleByName( usroName );

        if(userRoles.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userRoles.message,
                userRoles: userRoles.userRoles
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userRoles.status,
                mensaje: userRoles.message
            });
        };
    } catch (error) {
        next();
    };
};

const createUserRole = async (req, res, next) => {
    checkValidation(req);

    try {
        
       const {usroUserId, usroRoleId} = req.body;


        const userRoleExist = await UserRoleModel.UserRoleExist( usroUserId, usroRoleId);
        
        if( userRoleExist.type === 'error' ){
            throw new HttpException(500, userRoleExist.message );
        };
        
        const result = await UserRoleModel.createUserRole(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Usuarios Roles ha sido creado!'
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


const createUserRoles = async (req, res, next) => {
    checkValidation(req);

    try {
       const {userRoles} = req.body;

       const userRolesDeleteResult = await UserRoleModel.deleteUserRoleByUserId( userRoles[0].usroUserId);
      // if (!userRolesDeleteResult) {
        //throw new HttpException(500, 'Error interno del servidor');
      // }else{
            for (i=0; i < userRoles.length; i++) {
                    if (userRoles[i].usroSelected === 'S'){
                        const result = await UserRoleModel.createUserRole(userRoles[i]);
                        if (!result || result.type === 'error') {
                            //throw new HttpException(500, 'Error interno del servidor');
                        };  
                    };
            }
      // }      


       res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Usuarios Roles han sido creados!'
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
const updateUserRole = async( req, res, next ) =>{

    const homologa = {
        'usroStatus' :'usro_status',
    };

    checkValidation(req);

    const {usro_status, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await UserRoleModel.updateUserRole(newRestOfUpdates[0], req.query.usroUserId, req.query.usroRoleId);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Usuarios Roles Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Usuarios Roles no se pudo actualizar'
        });
    };

};

const deleteUserRole = async (req, res, next) => {
    
    const usroUserId=req.query.usroUserId;
    const usroRoleId=req.query.usroRoleId;
    
    const result = await UserRoleModel.deleteUserRole(usroUserId,usroRoleId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Usuario Roles ha sido eliminado!'
    });
};

const deleteUserRoleByUserId = async (req, res, next) => {
    
    const usroUserId=req.query.usroUserId;
    
    const result = await UserRoleModel.deleteUserRoleByUserId(usroUserId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Usuario Roles ha sido eliminado!'
    });
};





checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllUserRoles,
    getUserRolesById,
    getAllUserRoleByName,
    createUserRole,
    createUserRoles,
    updateUserRole,
    deleteUserRole,
    deleteUserRoleByUserId
};