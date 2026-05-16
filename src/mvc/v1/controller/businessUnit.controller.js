const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const BusinessUnitModel = require('../model/businessUnit.model');

const getAllBusinessUnits = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm } = req.query;
        const businessUnits = await BusinessUnitModel.getAllBusinessUnits();

        if(businessUnits.type === 'ok'){

            const filterLength = filterOptions?.length || 0;
            let filteredBusinessUnits = businessUnits.businessUnits;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredBusinessUnits = filteredBusinessUnits.filter(
                    businessUnit => businessUnit.buName.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(businessUnit.buStatus));
                } else if (searchTerm) {
                    filteredBusinessUnits = filteredBusinessUnits.filter(businessUnit => businessUnit.buName.toLowerCase().includes(searchTerm.toLowerCase()));
                } else {
                    filteredBusinessUnits = filteredBusinessUnits.filter(businessUnit => filterOptions.includes(businessUnit.buStatus));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: businessUnits.message,
                businessUnits: filteredBusinessUnits//businessUnits.businessUnits
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: businessUnits.status,
                mensaje: businessUnits.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getBusinessUnitById = async( req, res, next ) => {

    const buCode = req.query.buCode;

    const businessUnit = await BusinessUnitModel.getBusinessUnitById( buCode );
    
    if(businessUnit){
        res.status(200).send({
            type: 'ok',
            status: 200,
            businessUnit: businessUnit
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Unidad de Negocio no encontrado'
        });
    };

};


const getAllBusinessUnitsByName = async( req, res, next ) => {

    const buName = req.query.buName;
    try {

        const businessUnits = await BusinessUnitModel.getAllBusinessUnitsByName( buName );

        if(businessUnits.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: businessUnits.message,
                businessUnits: businessUnits.businessUnits
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: businessUnits.status,
                mensaje: businessUnits.message
            });
        };
    } catch (error) {
        next();
    };
};

const createBusinessUnit = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {buCode} = req.body;
        const businessUnitExist = await BusinessUnitModel.businessUnitExists( buCode );
        
        if( businessUnitExist.type === 'error' ){
            throw new HttpException(500, businessUnitExist.message );
        };
        
        const result = await BusinessUnitModel.createBusinessUnit(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Unidad de Negocio ha sido creada!'
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

const updateBusinessUnit = async( req, res, next ) =>{

    const homologa = {
        'buName': 'bu_name',
        'buStatus': 'bu_status'
    };

    checkValidation(req);

    const {bu_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await BusinessUnitModel.updateBusinessUnit(newRestOfUpdates[0], req.query.buCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Unidad de Negocio Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Unidad de Negocio no se pudo actualizar'
        });
    };

};

const deleteBusinessUnit = async (req, res, next) => {
    
    const buCode = req.query.buCode;

    const result = await BusinessUnitModel.deleteBusinessUnit(buCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Unidad de Negocio ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllBusinessUnits,
    getBusinessUnitById,
    getAllBusinessUnitsByName,
    createBusinessUnit,
    updateBusinessUnit,
    deleteBusinessUnit
};