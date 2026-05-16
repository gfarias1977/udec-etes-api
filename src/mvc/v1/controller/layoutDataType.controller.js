const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const LayoutDataTypeModel = require('../model/layoutDataType.model');

const getAllLayoutDataTypes = async( req, res, next ) => {

    try {
        const layoutDataTypes = await LayoutDataTypeModel.getAllLayoutDataTypes();

        if(layoutDataTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: layoutDataTypes.message,
                layoutDataTypes: layoutDataTypes.layoutDataTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: layoutDataTypes.status,
                mensaje: layoutDataTypes.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getLayoutDataTypeById = async( req, res, next ) => {

    const laydCode = req.query.laydCode;

    const layoutDataType = await LayoutDataTypeModel.getLayoutDataTypeById( laydCode );
    
    if(layoutDataType){
        res.status(200).send({
            type: 'ok',
            status: 200,
            layoutDataType: layoutDataType
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Tipo de Layout no encontrada'
        });
    };

};


const getAllLayoutDataTypesByName = async( req, res, next ) => {

    const laydName = req.query.laydName;
    try {

        const layoutDataTypes = await LayoutDataTypeModel.getAllLayoutDataTypeByName( laydName );

        if(layoutDataTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: layoutDataTypes.message,
                layoutDataTypes: layoutDataTypes.layoutDataTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: layoutDataTypes.status,
                mensaje: layoutDataTypes.message
            });
        };
    } catch (error) {
        next();
    };
};

const createLayoutDataType = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {laydCode} = req.body;
        const layoutDataTypeExist = await LayoutDataTypeModel.layoutDataTypeExist( laydCode );
        
        if( layoutDataTypeExist.type === 'error' ){
            throw new HttpException(500, layoutDataTypeExist.message );
        };
        
        const result = await LayoutDataTypeModel.createLayoutDataType(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Tipo de Layout ha sido creado!'
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

const updateLayoutDataType = async( req, res, next ) =>{

    const homologa = {
        'laydName'         :'layd_name',
        'laydDocumentType' :'layd_document_type',
        'laydStatus'       :'layd_status'  
    };

    checkValidation(req);

    const {layd_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await LayoutDataTypeModel.updateLayoutDataType(newRestOfUpdates[0], req.query.laydCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Tipo de Layout Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Tipo de Layout no se pudo actualizar'
        });
    };

};

const deleteLayoutDataType = async (req, res, next) => {
    
    const laydCode = req.query.laydCode;

    const result = await LayoutDataTypeModel.deleteLayoutDataType(laydCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Tipo de Layout ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllLayoutDataTypes,
    getLayoutDataTypeById,
    getAllLayoutDataTypesByName,
    createLayoutDataType,
    updateLayoutDataType,
    deleteLayoutDataType
};