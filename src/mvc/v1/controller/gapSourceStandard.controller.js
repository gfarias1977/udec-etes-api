const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const GapSourceStandardModel = require('../model/gapSourceStandard.model');

const getAllGapSourceStandardByParameters= async( req, res, next ) => {

    try {
        const { 
            filterOptions, 
            searchTerm, 
            gapsProcId,
            gapsProcCode,      
            gapsBuCode,    
            gapsOrgCode,	
            gapsStdCode,	
            gapsStdVersion,
            gapsCoursCode,
            gapsRlayCode,	 
            gapsPurcCode,	 
            gapsItemCode	            
            } = req.query;

        const gapsSourceStandard = await GapSourceStandardModel.getAllGapSourceStandardByParameters(
            gapsProcId,
            gapsProcCode,      
            gapsBuCode,    
            gapsOrgCode,	
            gapsStdCode,	
            gapsStdVersion,
            gapsCoursCode,
            gapsRlayCode,	 
            gapsPurcCode,	 
            gapsItemCode	);

        if(gapsSourceStandard.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredGapSourceStandard = gapsSourceStandard.gapsSourceStandard;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredGapSourceStandard = filteredGapSourceStandard.filter(
                        process  =>       process.gapsStdcOrgDescription.toLowerCase().includes(searchTerm.toLowerCase())      && filterOptions.includes(process.gapsStdcStatus) ||
                                          process.gapsStdcCoursCode.toLowerCase().includes(searchTerm.toLowerCase())           && filterOptions.includes(process.gapsStdcStatus) ||
                                          process.gapsStdcCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())    && filterOptions.includes(process.gapsStdcStatus) ||
                                          process.gapsStdcRlayCode.toLowerCase().includes(searchTerm.toLowerCase())            && filterOptions.includes(process.gapsStdcStatus) ||
                                          process.gapsStdcItemName.toLowerCase().includes(searchTerm.toLowerCase())            && filterOptions.includes(process.gapsStdcStatus) ||
                                          process.gapsStdcItemCode.toLowerCase().includes(searchTerm.toLowerCase())            && filterOptions.includes(process.gapsStdcStatus)  );
                } else if (searchTerm) {
                    filteredGapSourceStandard = filteredGapSourceStandard.filter(process =>    
                                                                                         process.gapsStdcOrgDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                                                         process.gapsStdcCoursCode.toLowerCase().includes(searchTerm.toLowerCase())      || 
                                                                                         process.gapsStdcCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())       ||
                                                                                         process.gapsStdcRlayCode.toLowerCase().includes(searchTerm.toLowerCase())   ||
                                                                                         process.gapsStdcItemName.toLowerCase().includes(searchTerm.toLowerCase())   ||
                                                                                         process.gapsStdcItemCode.toLowerCase().includes(searchTerm.toLowerCase())     );
                } else {
                    filteredGapSourceStandard = filteredGapSourceStandard.filter(process => filterOptions.includes(process.gapsStdcStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: process.message,
                gapsSourceStandard: filteredGapSourceStandard
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: gapsSourceStandard.status,
                mensaje: gapsSourceStandard.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const bulkLoadStandard = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const result = await GapSourceStandardModel.bulkLoadStandard(req.body);

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
checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllGapSourceStandardByParameters,
    bulkLoadStandard,
};