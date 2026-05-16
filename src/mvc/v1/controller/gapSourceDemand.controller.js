const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const GapSourceDemandModel = require('../model/gapSourceDemand.model');

const getAllGapSourceDemandByParameters= async( req, res, next ) => {

    try {
        const { 
            filterOptions, 
            searchTerm, 
            gapdProcId,
            gapdProcCode,
            gapdStdcAcademicYear,
            gapdStdcAcademicPeriod,
            gapdOrgCode,
            gapdCampCode,      
            gapdSchoCode,        
            gapdCoursCode,      
            gapdWktCode,       
            gapdActCode,     
            gapdCityCode} = req.query;

        const gapsSourceDemand = await GapSourceDemandModel.getAllGapSourceDemandByParameters(
            gapdProcId,
            gapdProcCode,
            gapdStdcAcademicYear,
            gapdStdcAcademicPeriod,
            gapdOrgCode,
            gapdCampCode,      
            gapdSchoCode,        
            gapdCoursCode,      
            gapdWktCode,       
            gapdActCode,     
            gapdCityCode);

        if(gapsSourceDemand.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredGapSourceDemand = gapsSourceDemand.gapsSourceDemand;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredGapSourceDemand = filteredGapSourceDemand.filter(
                        process  =>       process.gapdOrgDescription.toLowerCase().includes(searchTerm.toLowerCase())   && filterOptions.includes(process.gapdActCode) ||
                                          process.gapdCampDescription.toLowerCase().includes(searchTerm.toLowerCase())        && filterOptions.includes(process.gapdActCode) ||
                                          process.gapdschoDescription.toLowerCase().includes(searchTerm.toLowerCase())         && filterOptions.includes(process.gapdActCode) ||
                                          process.gapdCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())     && filterOptions.includes(process.gapdActCode) ||
                                          process.gapdtCity.toLowerCase().includes(searchTerm.toLowerCase())              && filterOptions.includes(process.gapdActCode)  );
                } else if (searchTerm) {
                    filteredGapSourceDemand = filteredGapSourceDemand.filter(process =>    process.gapdOrgDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                                                         process.gapdCampDescription.toLowerCase().includes(searchTerm.toLowerCase())      || 
                                                                                         process.gapdschoDescription.toLowerCase().includes(searchTerm.toLowerCase())       ||
                                                                                         process.gapdCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())   ||
                                                                                         process.gapdtCity.toLowerCase().includes(searchTerm.toLowerCase())     );
                } else {
                    filteredGapSourceDemand = filteredGapSourceDemand.filter(process => filterOptions.includes(process.gapdActCode));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: process.message,
                gapsSourceDemand: filteredGapSourceDemand
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: gapsSourceDemand.status,
                mensaje: gapsSourceDemand.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const bulkLoadDemand = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const result = await GapSourceDemandModel.bulkLoadDemand(req.body);

        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: result.message,
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

const getAllDemandPeriods= async( req, res, next ) => {

    try {
        const demandPeriods = await GapSourceDemandModel.getAllDemandPeriods();

        if(demandPeriods.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: demandPeriods.message,
                demandPeriods: demandPeriods.demandPeriods
            });

        }else{
            res.status(401).send( {
                type: 'error',
                status: demandPeriods.status,
                mensaje: demandPeriods.message
            });
        };
    } catch (error) {
        next();
    };
}

checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllGapSourceDemandByParameters,
    bulkLoadDemand,
    getAllDemandPeriods
};