const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const UserChargeAccountModel = require('../model/userChargeAccount.model');

const getAllUserChargeAccounts = async( req, res, next ) => {

    try {
        const userChargeAccounts = await UserChargeAccountModel.getAllUserChargeAccounts();

        if(userChargeAccounts.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userChargeAccounts.message,
                userChargeAccounts: userChargeAccounts.userChargeAccounts
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userChargeAccounts.status,
                mensaje: userChargeAccounts.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getUserChargeAccountById = async( req, res, next ) => {

    const ucacUserId = req.query.ucacUserId;
    const ucacPurcCode = req.query.ucacPurcCode;
    const ucacCaccCode = req.query.ucacCaccCode;


    const userChargeAccount = await UserChargeAccountModel.getUserChargeAccountById( ucacUserId, ucacPurcCode,ucacCaccCode );
    
    if(userChargeAccount){
        res.status(200).send({
            type: 'ok',
            status: 200,
            userChargeAccount: userChargeAccount
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Usuarios-Area de Compra-Centro de Costo no encontrado'
        });
    };

};


const getAllUserChargeAccountsByName = async( req, res, next ) => {

    const ucacName = req.query.ucacName;
    try {

        const userChargeAccounts = await UserChargeAccountModel.getAllUserChargeAccountByName( ucacName );

        if(userChargeAccounts.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: userChargeAccounts.message,
                userChargeAccounts: userChargeAccounts.userChargeAccounts
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: userChargeAccounts.status,
                mensaje: userChargeAccounts.message
            });
        };
    } catch (error) {
        next();
    };
};

const createUserChargeAccount = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {ucacUserId, ucacPurcCode,ucacCaccCode} = req.body;
        const userChargeAccountExist = await UserChargeAccountModel.userChargeAccountExist( ucacUserId, ucacPurcCode,ucacCaccCode );
        
        if( userChargeAccountExist.type === 'error' ){
            throw new HttpException(500, userChargeAccountExist.message );
        };
        
        const result = await UserChargeAccountModel.createUserChargeAccount(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Usuarios-Area de Compra-Centro de Costo ha sido creado!'
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

const updateUserChargeAccount = async( req, res, next ) =>{

    const homologa = {
        'ucacStatus' :'ucac_status',
    };

    checkValidation(req);

    const {ucac_status, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await UserChargeAccountModel.updateUserChargeAccount(newRestOfUpdates[0], req.query.ucacUserId, req.query.ucacPurcCode,req.query.ucacCaccCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Usuarios-Area de Compra-Centro de Costo Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Usuarios-Area de Compra-Centro de Costo no se pudo actualizar'
        });
    };

};

const deleteUserChargeAccount = async (req, res, next) => {
    
    const ucacUserId=req.query.ucacUserId;
    const ucacPurcCode=req.query.ucacPurcCode;
    const ucacCaccCode =req.query.ucacCaccCode;
    
    const result = await UserChargeAccountModel.deleteUserChargeAccount(ucacUserId,ucacPurcCode,ucacCaccCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Usuarios-Area de Compra-Centro de Costo ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllUserChargeAccounts,
    getUserChargeAccountById,
    getAllUserChargeAccountsByName,
    createUserChargeAccount,
    updateUserChargeAccount,
    deleteUserChargeAccount
};