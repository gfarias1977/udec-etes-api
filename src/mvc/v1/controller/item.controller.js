const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ItemModel = require('../model/item.model');

const getAllItems = async( req, res, next ) => {

    try {
        const {orgCode, purcCode, famCode, subFamCode , filterOptions, searchTerm} = req.query;
        const items = await ItemModel.getAllItems(orgCode, purcCode, famCode, subFamCode);

        if(items.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredItems = items.items;

            if ( searchTerm || filterLength > 0) {
                if (searchTerm ) {
                   filteredItems = filteredItems.filter(item => item.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) 
                                                            ||  item.itemItmcSubFamCode.toString().includes(searchTerm.toLowerCase())
                                                            ||  item.itemItmcSubFamName.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  item.itemItmcFamCode.toString().includes(searchTerm.toLowerCase())
                                                            ||  item.itemItmcFamName.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  item.itemCode.toString().includes(searchTerm.toLowerCase()));
                } 
                if (filterLength > 0){
                    filteredItems = filteredItems.filter(item => filterOptions.includes(item.itemStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: items.message,
                items: filteredItems
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: items.status,
                mensaje: items.message
            });
        };
    } catch (error) {
        next();
    };
   
};

const getItemById = async( req, res, next ) => {

    const itemCode = req.query.itemCode;
    const itemPurcCode = req.query.itemPurcCode;

    const item = await ItemModel.getItemById( itemCode, itemPurcCode );
    
    if(item){
        res.status(200).send({
            type: 'ok',
            status: 200,
            item: item
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Bien no encontrado'
        });
    };

};


const getAllItemsByName = async( req, res, next ) => {

    const itemName = req.query.itemName;
    try {

        const items = await ItemModel.getAllItemsByName( itemName );

        if(items.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: items.message,
                items: items.items
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: items.status,
                mensaje: items.message
            });
        };
    } catch (error) {
        next();
    };
};



const getAllItemsByParentCode = async( req, res, next ) => {

    const itemPurcCode = req.query.itemPurcCode;
    const itemItmcCode = req.query.itemItmcCode;

    try {
        const items = await ItemModel.getAllItemsByParentCode(itemPurcCode,itemItmcCode);

        if(items.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: items.message,
                items: items.items
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: items.status,
                mensaje: items.message
            });
        };
    } catch (error) {
        next();
    };
    
};


const createItem = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {itemName, itemPurcCode} = req.body;
        const itemExist = await ItemModel.itemExist( itemName, itemPurcCode );
       
        if( itemExist.type === 'error' ){
            throw new HttpException(500, itemExist.message );
        };
        
        const result = await ItemModel.createItem(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
           // message: 'Bien ha sido creado! id:' 
           message: result.id,
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

const updateItem = async( req, res, next ) =>{

    const homologa = {
        'itemPurcCode'         :'item_purc_code',
        'itemDescription'      :'item_description',
        'itemName'             :'item_name',
        'itemItmcCode'         :'item_itmc_code',
        'itemRenewalCycle'     :'item_renewal_cycle',
        'itemMaintenanceCycle' :'item_maintenance_cycle',
        'itemCurrencyCode'     :'item_currency_code',
        'itemUnitValue'        :'item_unit_value',
        'itemAttribute01'      :'item_attribute_01',
        'itemValue01'          :'item_value_01',
        'itemAttribute02'      :'item_attribute_02',
        'itemValue02'          :'item_value_02',
        'itemAttribute03'      :'item_attribute_03',
        'itemValue03'          :'item_value_03',
        'itemAttribute04'      :'item_attribute_04',
        'itemValue04'          :'item_value_04',
        'itemAttribute05'      :'item_attribute_05',
        'itemValue05'          :'item_value_05',
        'itemAttribute06'      :'item_attribute_06',
        'itemValue06'          :'item_value_06',
        'itemAttribute07'      :'item_attribute_07',
        'itemValue07'          :'item_value_07',                        
        'itemStatus'           :'item_status'
    };

    checkValidation(req);

    const {item_purc_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ItemModel.updateItem(newRestOfUpdates[0], req.query.itemCode );
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Bien Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Bien no se pudo actualizar'
        });
    };

};

const deleteItem = async (req, res, next) => {
    
    const itemCode = req.query.itemCode;

    const result = await ItemModel.deleteItem(itemCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Bien ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllItems,
    getItemById,
    getAllItemsByName,
    getAllItemsByParentCode,
    createItem,
    updateItem,
    deleteItem
};