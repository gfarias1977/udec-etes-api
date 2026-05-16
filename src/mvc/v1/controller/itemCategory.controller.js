const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ItemCategoryModel = require('../model/itemCategory.model');

const getAllItemCategories = async( req, res, next ) => {

    try {
        const itemCategories = await ItemCategoryModel.getAllItemCategories();

        if(itemCategories.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: itemCategories.message,
                itemCategories: itemCategories.itemCategories
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: itemCategories.status,
                mensaje: itemCategories.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getItemCategoryById = async( req, res, next ) => {

    const itmcCode = req.query.itmcCode;
    const itmcPurcCode = req.query.itmcPurcCode;

    const itemCategory = await ItemCategoryModel.getItemCategoryById( itmcCode, itmcPurcCode );
    
    if(itemCategory){
        res.status(200).send({
            type: 'ok',
            status: 200,
            itemCategory: itemCategory
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Categoria de Bienes no encontrado'
        });
    };

};


const getAllItemCategoriesByName = async( req, res, next ) => {

    const itmcName = req.query.itmcName;
    try {

        const itemCategories = await ItemCategoryModel.getAllItemCategoriesByName( itmcName );

        if(itemCategories.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: itemCategories.message,
                itemCategories: itemCategories.itemCategories
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: itemCategories.status,
                mensaje: itemCategories.message
            });
        };
    } catch (error) {
        next();
    };
};

const getAllItemCategoriesByPurcCode = async( req, res, next ) => {

    const itmcPurcCode = req.query.itmcPurcCode;

    try {
        const itemCategories = await ItemCategoryModel.getAllItemCategoriesByPurcCode(itmcPurcCode);

        if(itemCategories.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: itemCategories.message,
                itemCategories: itemCategories.itemCategories
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: itemCategories.status,
                mensaje: itemCategories.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getAllItemCategoriesByParentCode = async( req, res, next ) => {

    const itmcPurcCode = req.query.itmcPurcCode;
    const itmcParentCode = req.query.itmcParentCode;

    try {
        const itemCategories = await ItemCategoryModel.getAllItemCategoriesByParentCode(itmcPurcCode, itmcParentCode);

        if(itemCategories.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: itemCategories.message,
                itemCategories: itemCategories.itemCategories
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: itemCategories.status,
                mensaje: itemCategories.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const createItemCategory = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {itmcName, itmcPurcCode} = req.body;
        const itemCategoryExist = await ItemCategoryModel.itemCategoryExist( itmcName, itmcPurcCode );
       
        if( itemCategoryExist.type === 'error' ){
            throw new HttpException(500, itemCategoryExist.message );
       };
        
        const result = await ItemCategoryModel.createItemCategory(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Categoria de Bienes ha sido creado!'
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

const updateItemCategory = async( req, res, next ) =>{

    const homologa = {
        'itmcPurcCode'     :'itmc_purc_code',
        'itmcName'         :'itmc_name',
        'itmcDescription'  :'itmc_description',
        'itmcOrder'        :'itmc_order',                        
        'itmcParentCode'   :'itmc_parent_code',
        'itmcStatus'       :'itmc_status',  
    };

    checkValidation(req);

    const {itmc_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ItemCategoryModel.updateItemCategory(newRestOfUpdates[0], req.query.itmcCode,req.query.itmcPurcCode );
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Categoria de Bienes Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Categoria de Bienes no se pudo actualizar'
        });
    };

};

const deleteItemCategory = async (req, res, next) => {
    
    const itmcCode = req.query.itmcCode;
    const itmcPurcCode = req.query.itmcPurcCode;

    const result = await ItemCategoryModel.deleteItemCategory(itmcCode, itmcPurcCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Categoria de Bienes ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllItemCategories,
    getItemCategoryById,
    getAllItemCategoriesByName,
    getAllItemCategoriesByPurcCode,
    getAllItemCategoriesByParentCode,
    createItemCategory,
    updateItemCategory,
    deleteItemCategory
};