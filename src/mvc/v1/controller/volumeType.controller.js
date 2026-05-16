const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const volumeType = require('../model/volumeType.model');

const getAllVolumeTypes = async( req, res, next ) => {

    try {
        const volumeTypes = await volumeType.getAllVolumeTypes();

        if(volumeTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: volumeTypes.message,
                volumeTypes: volumeTypes.volumeTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: volumeTypes.status,
                mensaje: volumeTypes.message
            });
        };
    } catch (error) {
        next();
    };
    
};


const createVolumeType = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {vlmCode} = req.body;
        const volumeTypeExist = await volumeType.volumeTypeExists( vlmCode );
        
        if( volumeTypeExist.type === 'error' ){
            throw new HttpException(500, volumeTypeExist.message );
        };
        
        const result = await volumeType.createVolumeType(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Volúmen Bibliográfico ha sido creada!'
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

const updateVolumeType = async( req, res, next ) =>{

    const homologa = {

        'vlmCode'          :'vlm_code',
        'vlmDescription'   :'vlm_description',
        'vlmStatus'        :'vlm_status',  
    };

    checkValidation(req);

    const {vlm_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await volumeType.updateVolumeType(newRestOfUpdates[0], req.query.vlmId);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Volumen Bibliográfico Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Volumen Bibliográfico no se pudo actualizar'
        });
    };

};

const deleteVolumeType = async (req, res, next) => {
    
    const vlmId = req.query.vlmId;

    const result = await volumeType.deleteVolumeType(vlmId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Volumen Bibliográfico ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllVolumeTypes,
    createVolumeType,
    updateVolumeType,
    deleteVolumeType
};