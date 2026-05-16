const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ActivityModel = require('../model/activity.model');

const getAllActivities = async( req, res, next ) => {

    try {
        const activities = await ActivityModel.getAllActivities();

        if(activities.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: activities.message,
                activities: activities.activities
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: activities.status,
                mensaje: activities.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getActivityById = async( req, res, next ) => {

    const actCode = req.query.actCode;

    const activity = await ActivityModel.getActivityById( actCode );
    
    if(activity){
        res.status(200).send({
            type: 'ok',
            status: 200,
            activity: activity
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Actividad no encontrada'
        });
    };

};


const getAllActivitiesByName = async( req, res, next ) => {

    const actName = req.query.actName;
    try {

        const activities = await ActivityModel.getAllActivitiesByName( actName );

        if(activities.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: activities.message,
                activities: activities.activities
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: activities.status,
                mensaje: activities.message
            });
        };
    } catch (error) {
        next();
    };
};

const createActivity = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {actCode} = req.body;
        const activityExist = await ActivityModel.activityExists( actCode );
        
        if( activityExist.type === 'error' ){
            throw new HttpException(500, activityExist.message );
        };
        
        const result = await ActivityModel.createActivity(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Actividad ha sido creada!'
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

const updateActivity = async( req, res, next ) =>{

    const homologa = {
        'actName': 'act_name',
        'actStatus': 'act_status'
    };

    checkValidation(req);

    const {act_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ActivityModel.updateActivity(newRestOfUpdates[0], req.query.actCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Actividad Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Actividad no se pudo actualizar'
        });
    };

};

const deleteActivity = async (req, res, next) => {
    
    const actCode = req.query.actCode;

    const result = await ActivityModel.deleteActivity(actCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Actividad ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllActivities,
    getActivityById,
    getAllActivitiesByName,
    createActivity,
    updateActivity,
    deleteActivity
};