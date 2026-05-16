const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const GapModel = require('../model/gap.model');

const getAllGapDemandVsStockByParameters= async( req, res, next ) => {

    try {
        const { 
            filterOptions, 
            searchTerm, 
            gapProcId,
            gapProcCode,
            gapStdcAcademicYear,
            gapStdcAcademicPeriod,
            gapOrgCode,
            gapCampCode,
            gapSchoCode,
            gapCoursCode,
            gapItemCode,
            gapVolume,
            gapCityCode} = req.query;

        const gapsDda = await GapModel.getAllGapDemandVsStockByParameters(
            gapProcId,
            gapProcCode,
            gapStdcAcademicYear,
            gapStdcAcademicPeriod,
            gapOrgCode,
            gapCampCode,
            gapSchoCode,
            gapCoursCode,
            gapItemCode,
            gapVolume,
            gapCityCode);

        if(gapsDda.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredGap = gapsDda.gapsDda;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredGap = filteredGap.filter(
                        process  =>       process.gaprSchoDescription.toLowerCase().includes(searchTerm.toLowerCase())    && filterOptions.includes(process.gaprItemActive) ||
                                          process.gaprCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())   && filterOptions.includes(process.gaprItemActive) ||
                                          process.gaprCampDescription.toLowerCase().includes(searchTerm.toLowerCase())    && filterOptions.includes(process.gaprItemActive) ||
                                          process.gaprTitle.toLowerCase().includes(searchTerm.toLowerCase())              && filterOptions.includes(process.gaprItemActive) ||
                                          process.gaprCityCode.toLowerCase().includes(searchTerm.toLowerCase())           && filterOptions.includes(process.gaprItemActive)  );
                } else if (searchTerm) {
                    filteredGap = filteredGap.filter(process =>    process.gaprSchoDescription.toLowerCase().includes(searchTerm.toLowerCase())       || 
                                                                   process.gaprCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())      || 
                                                                   process.gaprCampDescription.toLowerCase().includes(searchTerm.toLowerCase())       ||
                                                                   process.gaprTitle.toLowerCase().includes(searchTerm.toLowerCase())                 ||
                                                                   process.gaprCityCode.toLowerCase().includes(searchTerm.toLowerCase())     );
                } else {
                    filteredGap = filteredGap.filter(process => filterOptions.includes(process.gaprItemActive));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: gapsDda.message,
                gapsDda: filteredGap
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: gaps.status,
                mensaje: gaps.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getAllGapStockVsDemandByParameters= async( req, res, next ) => {

    try {
        const { 
            filterOptions, 
            searchTerm, 
            gapProcId,
            gapProcCode,
            gapStdcAcademicYear,
            gapStdcAcademicPeriod,
            gapOrgCode,
            gapCampCode,
            gapSchoCode,
            gapCoursCode,
            gapItemCode,
            gapVolume,
            gapCityCode} = req.query;

        const gapsStk = await GapModel.getAllGapStockVsDemandByParameters(
            gapProcId,
            gapProcCode,
            gapStdcAcademicYear,
            gapStdcAcademicPeriod,
            gapOrgCode,
            gapCampCode,
            gapSchoCode,
            gapCoursCode,
            gapItemCode,
            gapVolume,
            gapCityCode);

        if(gapsStk.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredGap = gapsStk.gapsStk;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredGap = filteredGap.filter(
                        process  =>       process.gaprSchoDescription.toLowerCase().includes(searchTerm.toLowerCase())    && filterOptions.includes(process.gaprItemActive) ||
                                          process.gaprCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())   && filterOptions.includes(process.gaprItemActive) ||
                                          process.gaprCampDescription.toLowerCase().includes(searchTerm.toLowerCase())    && filterOptions.includes(process.gaprItemActive) ||
                                          process.gaprTitle.toLowerCase().includes(searchTerm.toLowerCase())              && filterOptions.includes(process.gaprItemActive) ||
                                          process.gaprCityCode.toLowerCase().includes(searchTerm.toLowerCase())           && filterOptions.includes(process.gaprItemActive)  );
                } else if (searchTerm) {
                    filteredGap = filteredGap.filter(process =>    process.gaprSchoDescription.toLowerCase().includes(searchTerm.toLowerCase())       || 
                                                                   process.gaprCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())      || 
                                                                   process.gaprCampDescription.toLowerCase().includes(searchTerm.toLowerCase())       ||
                                                                   process.gaprTitle.toLowerCase().includes(searchTerm.toLowerCase())                 ||
                                                                   process.gaprCityCode.toLowerCase().includes(searchTerm.toLowerCase())     );
                } else {
                    filteredGap = filteredGap.filter(process => filterOptions.includes(process.gaprItemActive));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: process.message,
                gapsStk: filteredGap
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: gapsStk.status,
                mensaje: gapsStk.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const gapCalculation = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const result = await GapModel.gapCalculation(req.body);

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

const getAllGapPeriodsDda= async( req, res, next ) => {

    try {
        const gapPeriodsDda = await GapModel.getAllGapPeriodsDda();

        if(gapPeriodsDda.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: gapPeriodsDda.message,
                gapPeriodsDda: gapPeriodsDda.gapPeriodsDda
            });

        }else{
            res.status(401).send( {
                type: 'error',
                status: gapPeriodsDda.status,
                mensaje: gapPeriodsDda.message
            });
        };
    } catch (error) {
        next();
    };
}


const getAllGapPeriodsStk= async( req, res, next ) => {

    try {
        const gapPeriodsStk = await GapModel.getAllGapPeriodsStk();

        if(gapPeriodsStk.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: gapPeriodsStk.message,
                gapPeriodsStk: gapPeriodsStk.gapPeriodsStk
            });

        }else{
            res.status(401).send( {
                type: 'error',
                status: gapPeriodsStk.status,
                mensaje: gapPeriodsStk.message
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
    getAllGapDemandVsStockByParameters,
    getAllGapStockVsDemandByParameters,
    gapCalculation,
    getAllGapPeriodsDda,
    getAllGapPeriodsStk,

};