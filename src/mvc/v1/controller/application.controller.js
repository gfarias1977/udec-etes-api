const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ApplicationModel = require('../model/application.model');

const getAllApplications = async( req, res, next ) => {

    try {
        const applications = await ApplicationModel.getAllApplications();

        if(applications.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: applications.message,
                applications: applications.applications
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: applications.status,
                mensaje: applications.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getApplicationById = async( req, res, next ) => {

    const appId = req.query.appId;

    const application = await ApplicationModel.getApplicationById( appId );
    
    if(application){
        res.status(200).send({
            type: 'ok',
            status: 200,
            application: application
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Aplicacion no encontrada'
        });
    };

};


const getAllApplicationsByName = async( req, res, next ) => {

    const appDescription = req.query.appDescription;
    try {

        const applications = await ApplicationModel.getAllApplicationsByName( appDescription );

        if(applications.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: applications.message,
                applications: applications.applications
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: applications.status,
                mensaje: applications.message
            });
        };
    } catch (error) {
        next();
    };
};

const createApplication = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {appCode} = req.body;
        const aplicationExist = await ApplicationModel.applicationExists( appCode );
        
        if( aplicationExist.type === 'error' ){
            throw new HttpException(500, aplicationExist.message );
        };
        
        const result = await ApplicationModel.createApplication(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Applicacion ha sido creada!'
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

const updateApplication = async( req, res, next ) =>{

    const homologa = {
        'appDescription': 'app_description',
        'appParentId': 'app_parent_id',
        'appMenuDisplay': 'app_menu_display',
        'appUrl': 'app_url',
        'appOrder': 'app_order',
        'appComponent': 'app_component',
        'appAlt': 'app_alt',
        'appStatus': 'app_status'
    };

    checkValidation(req);

    const {app_description, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ApplicationModel.updateApplication(newRestOfUpdates[0], req.query.appId);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Aplicacion Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Aplicacion no se pudo actualizar'
        });
    };

};

const deleteApplication = async (req, res, next) => {
    
    const appId = req.query.appId;

    const result = await ApplicationModel.deleteApplication(appId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Aplicacion ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllApplications,
    getApplicationById,
    getAllApplicationsByName,
    createApplication,
    updateApplication,
    deleteApplication
};