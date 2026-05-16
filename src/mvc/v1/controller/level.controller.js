const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const LevelModel = require('../model/level.model');

const getAllLevels = async( req, res, next ) => {

    try {
        const levels = await LevelModel.getAllLevels();

        if(levels.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: levels.message,
                levels: levels.levels
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: levels.status,
                mensaje: levels.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getLevelById = async( req, res, next ) => {

    const levelCode = req.query.levelCode;

    const level = await LevelModel.getLevelById( levelCode );
    
    if(level){
        res.status(200).send({
            type: 'ok',
            status: 200,
            level: level
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Grado o Nivel Academico no encontrada'
        });
    };

};


const getAllLevelsByName = async( req, res, next ) => {

    const levelDescription = req.query.levelDescription;
    try {

        const levels = await LevelModel.getAllLevelByName( levelDescription );

        if(levels.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: levels.message,
                levels: levels.levels
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: levels.status,
                mensaje: levels.message
            });
        };
    } catch (error) {
        next();
    };
};

const createLevel = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {levelCode} = req.body;
        const levelExist = await LevelModel.levelExist( levelCode );
        
        if( levelExist.type === 'error' ){
            throw new HttpException(500, levelExist.message );
        };
        
        const result = await LevelModel.createLevel(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Grado o Nivel Academico ha sido creado!'
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

const updateLevel = async( req, res, next ) =>{

    const homologa = {
        'levelDescription' :'level_description',
        'levelStatus'      :'level_status'  
    };

    checkValidation(req);

    const {level_description, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await LevelModel.updateLevel(newRestOfUpdates[0], req.query.levelCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Grado o Nivel Academico Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Grado o Nivel Academico no se pudo actualizar'
        });
    };

};

const deleteLevel = async (req, res, next) => {
    
    const levelCode = req.query.levelCode;

    const result = await LevelModel.deleteLevel(levelCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Grado o Nivel Academico ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllLevels,
    getLevelById,
    getAllLevelsByName,
    createLevel,
    updateLevel,
    deleteLevel
};