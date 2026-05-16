const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const PurchaseAreaModel = require('../model/purchaseArea.model');

const getAllPurchaseAreas = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm } = req.query;
        const purchaseAreas = await PurchaseAreaModel.getAllPurchaseAreas();

        if(purchaseAreas.type === 'ok'){

            const filterLength = filterOptions?.length || 0;
            let filteredPurchaseAreas = purchaseAreas.purchaseAreas;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredPurchaseAreas = filteredPurchaseAreas.filter(
                        purchaseArea => purchaseArea.purcDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(purchaseArea.purcStatus) ||
                                        purchaseArea.pucName.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(purchaseArea.purcStatus));
                } else if (searchTerm) {
                    filteredPurchaseAreas = filteredPurchaseAreas.filter(purchaseArea => purchaseArea.purcDescription.toLowerCase().includes(searchTerm.toLowerCase())
                                                        || purchaseArea.purcName.toLowerCase().includes(searchTerm.toLowerCase()));
                } else {
                    filteredPurchaseAreas = filteredPurchaseAreas.filter(purchaseArea => filterOptions.includes(purchaseArea.purcStatus));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: purchaseAreas.message,
                purchaseAreas: filteredPurchaseAreas//purchaseAreas.purchaseAreas
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: purchaseAreas.status,
                mensaje: purchaseAreas.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getPurchaseAreaById = async( req, res, next ) => {

    const purcCode = req.query.purcCode;

    const purchaseArea = await PurchaseAreaModel.getPurchaseAreaById( purcCode );
    
    if(purchaseArea){
        res.status(200).send({
            type: 'ok',
            status: 200,
            purchaseArea: purchaseArea
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Area de Compra no encontrado'
        });
    };

};


const getAllPurchaseAreasByName = async( req, res, next ) => {

    const purcName = req.query.purcName;
    try {

        const purchaseAreas = await PurchaseAreaModel.getAllPurchaseAreasByName( purcName );

        if(purchaseAreas.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: purchaseAreas.message,
                purchaseAreas: purchaseAreas.purchaseAreas
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: purchaseAreas.status,
                mensaje: purchaseAreas.message
            });
        };
    } catch (error) {
        next();
    };
};

const createPurchaseArea= async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {purcCode} = req.body;
        const purchaseAreaExist = await PurchaseAreaModel.purchaseAreaExists( purcCode );
        
        if( purchaseAreaExist.type === 'error' ){
            throw new HttpException(500, purchaseAreaExist.message );
        };
        
        const result = await PurchaseAreaModel.createPurchaseArea(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Area de Compra ha sido creado!'
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

const updatePurchaseArea = async( req, res, next ) =>{

    const homologa = {
        'purcName': 'purc_name',
        'purcDescription': 'purc_description',
        'purcStatus': 'purc_status'
    };

    checkValidation(req);

    const {purc_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await PurchaseAreaModel.updatePurchaseArea(newRestOfUpdates[0], req.query.purcCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Area de Compra Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Area de Compra no se pudo actualizar'
        });
    };

};

const deletePurchaseArea = async (req, res, next) => {
    
    const purcCode = req.query.purcCode;

    const result = await PurchaseAreaModel.deletePurchaseArea(purcCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Area de Compra ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllPurchaseAreas,
    getPurchaseAreaById,
    getAllPurchaseAreasByName,
    createPurchaseArea,
    updatePurchaseArea,
    deletePurchaseArea
};