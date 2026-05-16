const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const RoomLayoutDataModel = require('../model/roomLayoutData.model');

const getAllRoomLayoutData = async( req, res, next ) => {

    try {
        const roomLayoutData = await RoomLayoutDataModel.getAllRoomLayoutData();

        if(roomLayoutData.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roomLayoutData.message,
                roomLayoutData: roomLayoutData.roomLayoutData
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roomLayoutData.status,
                mensaje: roomLayoutData.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getRoomLayoutDataById = async( req, res, next ) => {

    const rladLaydCode = req.query.rladLaydCode;
    const rladRlayCode = req.query.rladRlayCode;


    const roomLayoutData = await RoomLayoutDataModel.getRoomLayoutDataById( rladLaydCode, rladRlayCode );
    
    if(roomLayoutData){
        res.status(200).send({
            type: 'ok',
            status: 200,
            roomLayoutData: roomLayoutData
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Tipo de Documento del recinto no encontrado'
        });
    };

};


const getAllRoomLayoutDataByName = async( req, res, next ) => {

    const rladDescription = req.query.rladDescription;
    try {

        const roomLayoutData = await RoomLayoutDataModel.getAllRoomLayoutDataByName( rladDescription );

        if(roomLayoutData.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roomLayoutData.message,
                roomLayoutData: roomLayoutData.roomLayoutData
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roomLayoutData.status,
                mensaje: roomLayoutData.message
            });
        };
    } catch (error) {
        next();
    };
};

const createRoomLayoutData = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {rladLaydCode, rladRlayCode} = req.body;
        const roomLayoutDataExist = await RoomLayoutDataModel.roomLayoutDataExist( rladLaydCode, rladRlayCode);
        
        if( roomLayoutDataExist.type === 'error' ){
            throw new HttpException(500, roomLayoutDataExist.message );
        };
        
        const result = await RoomLayoutDataModel.createRoomLayoutData(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Tipo de Documento del recinto ha sido creado!'
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

const updateRoomLayoutData = async( req, res, next ) =>{

    const homologa = {
        'rladDescription' :'rlad_description',
        'rladData'        :'rlad_data'
    };

    checkValidation(req);

    const {rlad_description, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await RoomLayoutDataModel.updateRoomLayoutData(newRestOfUpdates[0], req.query.rladLaydCode, req.query.rladRlayCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Tipo de Documento del recinto Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Tipo de Documento del recinto no se pudo actualizar'
        });
    };

};

const deleteRoomLayoutData = async (req, res, next) => {
    
    const rladLaydCode=req.query.rladLaydCode;
    const rladRlayCode=req.query.rladRlayCode;
    
    const result = await RoomLayoutDataModel.deleteRoomLayoutData(rladLaydCode,rladRlayCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Tipo de Documento del recinto ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllRoomLayoutData,
    getRoomLayoutDataById,
    getAllRoomLayoutDataByName,
    createRoomLayoutData,
    updateRoomLayoutData,
    deleteRoomLayoutData
};