const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const RoomLayoutModel = require('../model/roomLayout.model');

const getAllRoomLayouts = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm } = req.query;
        const roomLayouts = await RoomLayoutModel.getAllRoomLayouts();

        if(roomLayouts.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredRoomLayouts = roomLayouts.roomLayouts;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredRoomLayouts = filteredRoomLayouts.filter(
                    roomLayout => roomLayout.rlayDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(roomLayout.rlayStatus) ||
                                 (roomLayout.stdcOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) ||
                                 (roomLayout.stdcStdCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) );
                } else if (searchTerm) {
                    filteredRoomLayouts = filteredRoomLayouts.filter(roomLayout => roomLayout.rlayDescription.toLowerCase().includes(searchTerm.toLowerCase())
                    (roomLayout.stdcOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) ||
                    (roomLayout.stdcStdCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) );                    
                } else {
                    filteredRoomLayouts = filteredRoomLayouts.filter(roomLayout => filterOptions.includes(roomLayout.rlayStatus));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roomLayouts.message,
                roomLayouts: filteredRoomLayouts//roomLayouts.roomLayouts
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roomLayouts.status,
                mensaje: roomLayouts.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getAllRoomLayoutsByPurcCode = async( req, res, next ) => {

    try {
        const { purcCode, filterOptions, searchTerm } = req.query;
        const roomLayouts = await RoomLayoutModel.getAllRoomLayoutsByPurcCode(purcCode);

        if(roomLayouts.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredRoomLayouts = roomLayouts.roomLayouts;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredRoomLayouts = filteredRoomLayouts.filter(
                    roomLayout => roomLayout.rlayDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(roomLayout.rlayStatus) ||
                                 (roomLayout.stdcOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) ||
                                 (roomLayout.stdcStdCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) );
                } else if (searchTerm) {
                    filteredRoomLayouts = filteredRoomLayouts.filter(roomLayout => roomLayout.rlayDescription.toLowerCase().includes(searchTerm.toLowerCase())
                    (roomLayout.stdcOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) ||
                    (roomLayout.stdcStdCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) );                    
                } else {
                    filteredRoomLayouts = filteredRoomLayouts.filter(roomLayout => filterOptions.includes(roomLayout.rlayStatus));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roomLayouts.message,
                roomLayouts: filteredRoomLayouts//roomLayouts.roomLayouts
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roomLayouts.status,
                mensaje: roomLayouts.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getRoomLayoutById = async( req, res, next ) => {

    const rlayCode = req.query.rlayCode;

    const roomLayout = await RoomLayoutModel.getRoomLayoutById( rlayCode );
    
    if(roomLayout){
        res.status(200).send({
            type: 'ok',
            status: 200,
            roomLayout: roomLayout
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Recinto Prototipo no encontrado'
        });
    };

};


const getAllRoomLayoutsByName = async( req, res, next ) => {

    const rlayDescription = req.query.rlayDescription;
    try {

        const roomLayouts = await RoomLayoutModel.getAllRoomLayoutsByName( rlayDescription );

        if(roomLayouts.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roomLayouts.message,
                roomLayouts: roomLayouts.roomLayouts
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roomLayouts.status,
                mensaje: roomLayouts.message
            });
        };
    } catch (error) {
        next();
    };
};

const getAllRoomLayoutsByParameters = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm, filterSelect,purcCode,buCode,stdCode,orgCode} = req.query;

        const roomLayouts = await RoomLayoutModel.getAllRoomLayoutsByParameters(purcCode, buCode,stdCode, orgCode);

        if(roomLayouts.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredRoomLayouts = roomLayouts.roomLayouts;

            if (searchTerm || filterSelect || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredRoomLayouts = filteredRoomLayouts.filter(
                    roomLayout => roomLayout.rlayDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(roomLayout.rlayStatus) || 
                    (roomLayout.stdcOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) ||
                    (roomLayout.stdcStdCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) );                    
                } else if (searchTerm) {
                    filteredRoomLayouts = filteredRoomLayouts.filter(roomLayout => roomLayout.rlayDescription.toLowerCase().includes(searchTerm.toLowerCase())
                    (roomLayout.stdcOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) ||
                    (roomLayout.stdcStdCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) );                    
                }else if (filterSelect) {
                    filteredRoomLayouts = filteredRoomLayouts.filter(roomLayout => 
                        (roomLayout.stdcOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((filterSelect).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) ||
                        (roomLayout.stdcStdCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((filterSelect).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) ); 
                } else {
                    filteredRoomLayouts = filteredRoomLayouts.filter(roomLayout => filterOptions.includes(roomLayout.rlayStatus));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roomLayouts.message,
                roomLayouts: filteredRoomLayouts//roomLayouts.roomLayouts
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roomLayouts.status,
                mensaje: roomLayouts.message
            });
        };
    } catch (error) {
        next();
    };
    
};


const createRoomLayout= async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {rlayCode} = req.body;
        const roomLayoutExist = await RoomLayoutModel.roomLayoutExist( rlayCode );
        
        if( roomLayoutExist.type === 'error' ){
            throw new HttpException(500, roomLayoutExist.message );
        };
        
        const result = await RoomLayoutModel.createRoomLayout(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Recinto Prototipo ha sido creado!'
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

const updateRoomLayout = async( req, res, next ) =>{

    const homologa = {
        'rlayDescription': 'rlay_description',
        'rlayCapacity'   : 'rlay_capacity',
        'rlayStatus'     : 'rlay_status'
    };

    checkValidation(req);

    const {rlay_description, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await RoomLayoutModel.updateRoomLayout(newRestOfUpdates[0], req.query.rlayCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Recinto Prototipo Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Recinto Prototipo no se pudo actualizar'
        });
    };

};

const deleteRoomLayout = async (req, res, next) => {
    
    const rlayCode = req.query.rlayCode;

    const result = await RoomLayoutModel.deleteRoomLayout(rlayCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Recinto Prototipo ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllRoomLayouts,
    getAllRoomLayoutsByPurcCode,
    getRoomLayoutById,
    getAllRoomLayoutsByName,
    getAllRoomLayoutsByParameters,
    createRoomLayout,
    updateRoomLayout,
    deleteRoomLayout
};