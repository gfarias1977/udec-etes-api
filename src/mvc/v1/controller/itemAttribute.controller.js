const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ItemAttributeModel = require('../model/itemAttribute.model');

const getAllItemAttributes = async( req, res, next ) => {

    try {
        const {filterOptions, searchTerm} = req.query;
        const itemAttributes = await ItemAttributeModel.getAllItemAttributes();

        if(itemAttributes.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredItemAttributes = itemAttributes.itemAttributes;

            if ( searchTerm || filterLength > 0) {
                if (searchTerm ) {
                    filteredItemAttributes = filteredItemAttributes.filter(itemAttribute => 
                                                                itemAttribute.itmaCode.toLowerCase().includes(searchTerm.toLowerCase()) 
                                                            ||  itemAttribute.itmaPurcCode.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  itemAttribute.itmaPurcName.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  itemAttribute.itmaOrder.toLowerCase().includes(searchTerm.toLowerCase()));
                } 
                if (filterLength > 0){
                    filteredItemAttributes = filteredItemAttributes.filter(itemAttribute => filterOptions.includes(itemAttribute.itemaStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: filteredItemAttributes.message,
                itemAttributes: filteredItemAttributes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: filteredItemAttributes.status,
                mensaje: filteredItemAttributes.message
            });
        };
    } catch (error) {
        next();
    };    
    
};

const getAllItemAttributesByPurcCode = async( req, res, next ) => {

    try {
        const {purcCode, filterOptions, searchTerm} = req.query;
        const itemAttributes = await ItemAttributeModel.getAllItemAttributesByPurcCode(purcCode);

        if(itemAttributes.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredItemAttributes = itemAttributes.itemAttributes;

            if ( searchTerm || filterLength > 0) {
                if (searchTerm ) {
                    filteredItemAttributes = filteredItemAttributes.filter(itemAttribute => 
                                                                itemAttribute.itmaCode.toLowerCase().includes(searchTerm.toLowerCase()) 
                                                            ||  itemAttribute.itmaPurcCode.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  itemAttribute.itmaPurcName.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  itemAttribute.itmaOrder.toLowerCase().includes(searchTerm.toLowerCase()));
                } 
                if (filterLength > 0){
                    filteredItemAttributes = filteredItemAttributes.filter(itemAttribute => filterOptions.includes(itemAttribute.itemaStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: filteredItemAttributes.message,
                itemAttributes: filteredItemAttributes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: filteredItemAttributes.status,
                mensaje: filteredItemAttributes.message
            });
        };
    } catch (error) {
        next();
    };    
    
};

const getItemAttributeById = async( req, res, next ) => {

    const itmaCode = req.query.itmaCode;
    const itmaPurcCode = req.query.itmaPurcCode;

    const itemAttribute = await ItemAttributeModel.getItemAttributeById( itmaCode, itmaPurcCode );
    
    if(itemAttribute){
        res.status(200).send({
            type: 'ok',
            status: 200,
            itemAttribute: itemAttribute
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Atributo de Bienes no encontrado'
        });
    };

};


const getAllItemAttributesByName = async( req, res, next ) => {

    const itmaCode = req.query.itmaCode;
    try {

        const itemAttributes = await ItemAttributeModel.getAllItemAttributesByName( itmaCode );

        if(itemAttributes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: itemAttributes.message,
                itemAttributes: itemAttributes.itemAttributes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: itemAttributes.status,
                mensaje: itemAttributes.message
            });
        };
    } catch (error) {
        next();
    };
};

const createItemAttribute = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {itmaCode, itmaPurcCode} = req.body;
        const itemAttributeExist = await ItemAttributeModel.itemAttributeExist( itmaCode, itmaPurcCode );
        
        if( itemAttributeExist.type === 'error' ){
            throw new HttpException(500, itemAttributeExist.message );
        };
        
        const result = await ItemAttributeModel.createItemAttribute(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Atributo de Bienes ha sido creado!'
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

const updateItemAttribute = async( req, res, next ) =>{

    const homologa = {
        'itmaOrder'        :'itma_order',
        'itmaStatus'       :'itma_status',  
    };

    checkValidation(req);

    const {itma_order, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ItemAttributeModel.updateItemAttribute(newRestOfUpdates[0], req.query.itmaCode,req.query.itmaPurcCode );
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Atributo de Bienes Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Atributo de Bienes no se pudo actualizar'
        });
    };

};

const deleteItemAttribute = async (req, res, next) => {
    
    const itmaCode = req.query.itmaCode;
    const itmaPurcCode = req.query.itmaPurcCode;

    const result = await ItemAttributeModel.deleteItemAttribute(itmaCode, itmaPurcCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Atributo de Bienes ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllItemAttributes,
    getAllItemAttributesByPurcCode,
    getItemAttributeById,
    getAllItemAttributesByName,
    createItemAttribute,
    updateItemAttribute,
    deleteItemAttribute
};