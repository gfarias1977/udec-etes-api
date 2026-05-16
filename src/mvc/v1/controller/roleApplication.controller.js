const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const RoleApplicationModel = require('../model/roleApplication.model');

const getAllRoleApplications = async( req, res, next ) => {

    try {
        const roleApplications = await RoleApplicationModel.getAllRoleApplications();

        if(roleApplications.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roleApplications.message,
                roleApplications: roleApplications.roleApplications
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roleApplications.status,
                mensaje: roleApplications.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getRoleApplicationById = async( req, res, next ) => {

    const rlapRoleId = req.query.rlapRoleId;
    const rlapAppId = req.query.rlapAppId;


    const roleApplication = await RoleApplicationModel.getRoleApplicationById( rlapRoleId, rlapAppId );
    
    if(roleApplication){
        res.status(200).send({
            type: 'ok',
            status: 200,
            roleApplication: roleApplication
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Rol Aplicacion no encontrado'
        });
    };

};


const getAllRoleApplicationByName = async( req, res, next ) => {

    const rlapName = req.query.rlapName;
    try {

        const roleApplications = await RoleApplicationModel.getAllRoleApplicationByName( rlapName );

        if(roleApplications.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roleApplications.message,
                roleApplications: roleApplications.roleApplications
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roleApplications.status,
                mensaje: roleApplications.message
            });
        };
    } catch (error) {
        next();
    };
};

const createRoleApplication = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {rlapRoleId, rlapAppId} = req.body;
        const roleApplicationExist = await RoleApplicationModel.roleApplicationExist( rlapRoleId, rlapAppId);
        
        if( roleApplicationExist.type === 'error' ){
            throw new HttpException(500, roleApplicationExist.message );
        };
        
        const result = await RoleApplicationModel.createRoleApplication(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Rol Aplicacion ha sido creado!'
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

const updateRoleApplication = async( req, res, next ) =>{

    const homologa = {
        'rlapStatus' :'rlap_status',
    };

    checkValidation(req);

    const {rlap_status, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await RoleApplicationModel.updateRoleApplication(newRestOfUpdates[0], req.query.rlapRoleId, req.query.rlapAppId);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Rol Aplicacion Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Role Aplicacion no se pudo actualizar'
        });
    };

};

const deleteRoleApplication = async (req, res, next) => {
    
    const rlapRoleId=req.query.rlapRoleId;
    const rlapAppId=req.query.rlapAppId;
    
    const result = await RoleApplicationModel.deleteRoleApplication(rlapRoleId,rlapAppId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Rol Aplicacion ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllRoleApplications,
    getRoleApplicationById,
    getAllRoleApplicationByName,
    createRoleApplication,
    updateRoleApplication,
    deleteRoleApplication
};