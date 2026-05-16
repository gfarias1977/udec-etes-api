const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const RealStateRoomTypeModel = require('../model/realStateRoomType.model');

const getAllRealStateRoomTypes = async( req, res, next ) => {

    try {
        const realStateRoomTypes = await RealStateRoomTypeModel.getAllRealStateRoomTypes();

        if(realStateRoomTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: realStateRoomTypes.message,
                realStateRoomTypes: realStateRoomTypes.realStateRoomTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: realStateRoomTypes.status,
                mensaje: realStateRoomTypes.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getRealStateRoomTypeById = async( req, res, next ) => {

    const rsrtCode = req.query.rsrtCode;

    const realStateRoomType = await RealStateRoomTypeModel.getRealStateRoomTypeById( rsrtCode );
    
    if(realStateRoomType){
        res.status(200).send({
            type: 'ok',
            status: 200,
            realStateRoomType: realStateRoomType
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Recinto Tipo no encontrada'
        });
    };

};


const getAllRealStateRoomTypeByName = async( req, res, next ) => {

    const rsrtName = req.query.rsrtName;
    try {

        const realStateRoomTypes = await RealStateRoomTypeModel.getAllProgamTypeByName( rsrtName );

        if(realStateRoomTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: realStateRoomTypes.message,
                realStateRoomTypes: realStateRoomTypes.realStateRoomTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: realStateRoomTypes.status,
                mensaje: realStateRoomTypes.message
            });
        };
    } catch (error) {
        next();
    };
};

const createRealStateRoomType = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {rsrtCode} = req.body;
        const realStateRoomTypeModelExist = await RealStateRoomTypeModel.realStateRoomTypeExist( rsrtCode );
        
        if( realStateRoomTypeModelExist.type === 'error' ){
            throw new HttpException(500, realStateRoomTypeModelExist.message );
        };
        
        const result = await RealStateRoomTypeModel.createRealStateRoomType(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Recinto Tipo ha sido creado!'
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

const updateRealStateRoomType = async( req, res, next ) =>{

    const homologa = {
        'rsrtDescription'  : 'rsrt_Description',
        'rsrtStatus'       : 'rsrt_status'
    };

    checkValidation(req);

    const {rsrt_Description, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await RealStateRoomTypeModel.updateRealStateRoomType(newRestOfUpdates[0], req.query.rsrtCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Recinto Tipo Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Recinto Tipo no se pudo actualizar'
        });
    };

};

const deleteRealStateRoomType = async (req, res, next) => {
    
    const rsrtCode = req.query.rsrtCode;

    const result = await RealStateRoomTypeModel.deleteRealStateRoomType(rsrtCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Recinto Tipo ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllRealStateRoomTypes,
    getRealStateRoomTypeById,
    getAllRealStateRoomTypeByName,
    createRealStateRoomType,
    updateRealStateRoomType,
    deleteRealStateRoomType
};