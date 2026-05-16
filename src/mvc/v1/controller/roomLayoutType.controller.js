const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const RoomLayoutTypeModel = require('../model/roomLayoutType.model');

const getAllRoomLayoutTypes = async( req, res, next ) => {

    try {
        const roomLayoutTypes = await RoomLayoutTypeModel.getAllRoomLayoutTypes();

        if(roomLayoutTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roomLayoutTypes.message,
                roomLayoutTypes: roomLayoutTypes.roomLayoutTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roomLayoutTypes.status,
                mensaje: roomLayoutTypes.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getRoomLayoutTypeById = async( req, res, next ) => {

    const rlatCode = req.query.rlatCode;

    const roomLayoutType = await RoomLayoutTypeModel.getRoomLayoutTypeById( rlatCode );
    
    if(roomLayoutType){
        res.status(200).send({
            type: 'ok',
            status: 200,
            roomLayoutType: roomLayoutType
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Recinto Tipo no encontrado'
        });
    };

};


const getAllRoomLayoutTypesByName = async( req, res, next ) => {

    const rlatDescription = req.query.rlatDescription;
    try {

        const roomLayoutTypes = await RoomLayoutTypeModel.getAllRoomLayoutTypesByName( rlatDescription );

        if(roomLayoutTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roomLayoutTypes.message,
                roomLayoutTypes: roomLayoutTypes.roomLayoutTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roomLayoutTypes.status,
                mensaje: roomLayoutTypes.message
            });
        };
    } catch (error) {
        next();
    };
};

const createRoomLayoutType = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {rlatCode} = req.body;
        const roomLayoutTypeExist = await RoomLayoutTypeModel.roomLayoutTypeExist( rlatCode );
        
        if( roomLayoutTypeExist.type === 'error' ){
            throw new HttpException(500, roomLayoutTypeExist.message );
        };
        
        const result = await RoomLayoutTypeModel.createRoomLayoutType(req.body);
        
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

const updateRoomLayoutType = async( req, res, next ) =>{

    const homologa = {
        'rlatDescription' :'rlat_description',
        'rlatStatus'      :'rlat_status'  
    };

    checkValidation(req);

    const {rlat_description, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await RoomLayoutTypeModel.updateRoomLayoutType(newRestOfUpdates[0], req.query.rlatCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Recinto Tipo Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Recinto Tipo no se pudo actualizar'
        });
    };

};

const deleteRoomLayoutType = async (req, res, next) => {
    
    const rlatCode = req.query.rlatCode;

    const result = await RoomLayoutTypeModel.deleteRoomLayoutType(rlatCode);

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
    getAllRoomLayoutTypes,
    getRoomLayoutTypeById,
    getAllRoomLayoutTypesByName,
    createRoomLayoutType,
    updateRoomLayoutType,
    deleteRoomLayoutType
};