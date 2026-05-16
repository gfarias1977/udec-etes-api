const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ChargeAccountModel = require('../model/chargeAccount.model');

const getAllChargeAccount = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm } = req.query;
        const chargeAccounts = await ChargeAccountModel.getAllChargeAccount();

        if(chargeAccounts.type === 'ok'){

            const filterLength = filterOptions?.length || 0;
            let filteredChargeAccounts = chargeAccounts.chargeAccounts;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredChargeAccounts = filteredChargeAccounts.filter(
                        chargeAccount => chargeAccount.caccDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(chargeAccount.caccStatus) ||
                                        chargeAccount.caccOrgCode.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(chargeAccount.caccStatus)
                        );
                } else if (searchTerm) {
                    filteredChargeAccounts = filteredChargeAccounts.filter(chargeAccount => chargeAccount.caccDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                                            chargeAccount.caccOrgCode.toLowerCase().includes(searchTerm.toLowerCase())    );
                } else {
                    filteredChargeAccounts = filteredChargeAccounts.filter(chargeAccount => filterOptions.includes(chargeAccount.caccStatus));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: chargeAccounts.message,
                chargeAccounts: filteredChargeAccounts //chargeAccount.chargeAccount
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: chargeAccounts.status,
                mensaje: chargeAccounts.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getChargeAccountById = async( req, res, next ) => {

    const caccCode = req.query.caccCode;
    const caccOrgCode = req.query.caccOrgCode;

    const chargeAccount = await ChargeAccountModel.getChargeAccountById( caccCode, caccOrgCode );
    
    if(chargeAccount){
        res.status(200).send({
            type: 'ok',
            status: 200,
            chargeAccount: chargeAccount
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Centro de Costo no encontrada'
        });
    };

};


const getAllChargeAccountByName = async( req, res, next ) => {

    const caccDescription = req.query.caccDescription;
    try {

        const chargeAccount = await ChargeAccountModel.getAllChargeAccountByName( caccDescription );

        if(chargeAccount.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: chargeAccount.message,
                chargeAccount: chargeAccount.chargeAccount
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: chargeAccount.status,
                mensaje: chargeAccount.message
            });
        };
    } catch (error) {
        next();
    };
};

const getAllChargeAccountByUserId = async( req, res, next ) => {

    const caccUserId  = req.query.caccUserId;
    const caccOrgCode = req.query.caccOrgCode;
    try {
        const chargeAccount = await ChargeAccountModel.getAllChargeAccountByUserId(caccUserId, caccOrgCode);

        if(chargeAccount.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: chargeAccount.message,
                chargeAccount: chargeAccount.chargeAccount
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: chargeAccount.status,
                mensaje: chargeAccount.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const createChargeAccount = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {caccCode, caccOrgCode} = req.body;
        const chargeAccountExist = await ChargeAccountModel.chargeAccountExists( caccCode, caccOrgCode );
        
        if( chargeAccountExist.type === 'error' ){
            throw new HttpException(500, chargeAccountExist.message );
        };
        
        const result = await ChargeAccountModel.createChargeAccount(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Centro de Costo ha sido creado!'
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

const updateChargeAccount = async( req, res, next ) =>{

    const homologa = {
        'caccDescription'   : 'cacc_description', 
        'caccStatus'        : 'cacc_status'
    };

    checkValidation(req);

    const {cacc_description, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ChargeAccountModel.updateChargeAccount(newRestOfUpdates[0], req.query.caccCode, req.query.caccOrgCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Centro de Costo Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Centro de Costo no se pudo actualizar'
        });
    };

};

const deleteChargeAccount = async (req, res, next) => {
    
    const caccCode = req.query.caccCode;
    const caccOrgCode = req.query.caccOrgCode;

    const result = await ChargeAccountModel.deleteChargeAccount(caccCode, caccOrgCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Centro de Costo ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllChargeAccount,
    getChargeAccountById,
    getAllChargeAccountByName,
    getAllChargeAccountByUserId,
    createChargeAccount,
    updateChargeAccount,
    deleteChargeAccount
};