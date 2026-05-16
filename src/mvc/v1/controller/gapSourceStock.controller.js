const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const GapSourceStockModel = require('../model/gapSourceStock.model');

const getAllGapSourceStockByParameters= async( req, res, next ) => {

    try {
        const { 
            filterOptions, 
            searchTerm, 
            gapstPurcCode,       
            gapstProcId,     
            gapstProcCode,   
            gapstOrgCode,    
            gapstCampCode,   
            gapstCityCode,   
            gapstItemId,     
            gapstLibraryId,
            gapstVolumen,    
            gapstFormatType,
            gapstItemCode } = req.query;

        const gapsSourceStock = await GapSourceStockModel.getAllGapSourceStockByParameters(
            gapstPurcCode,       
            gapstProcId,     
            gapstProcCode,   
            gapstOrgCode,    
            gapstCampCode,   
            gapstCityCode,   
            gapstItemId,  
            gapstLibraryId,   
            gapstVolumen,    
            gapstFormatType,
            gapstItemCode);

        if(gapsSourceStock.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredGapSourceStock = gapsSourceStock.gapsSourceStock;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredGapSourceStock = filteredGapSourceStock.filter(
                        process  =>       process.gapstItemDescription.toLowerCase().includes(searchTerm.toLowerCase())   && filterOptions.includes(process.gapstFormat) ||
                                          process.gapstItemTitulo.toLowerCase().includes(searchTerm.toLowerCase())        && filterOptions.includes(process.gapstFormat) ||
                                          process.gapstItemAutor.toLowerCase().includes(searchTerm.toLowerCase())         && filterOptions.includes(process.gapstFormat) ||
                                          process.gapstItemEditorial.toLowerCase().includes(searchTerm.toLowerCase())     && filterOptions.includes(process.procStgapstFormatatus) ||
                                          process.gapstItemCode.toLowerCase().includes(searchTerm.toLowerCase())          && filterOptions.includes(process.procStgapstFormatatus) ||
                                          process.gapstCity.toLowerCase().includes(searchTerm.toLowerCase())              && filterOptions.includes(process.gapstFormat)  );
                } else if (searchTerm) {
                    filteredGapSourceStock = filteredGapSourceStock.filter(process =>    process.gapstItemDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                                                         process.gapstItemTitulo.toLowerCase().includes(searchTerm.toLowerCase())      || 
                                                                                         process.gapstItemAutor.toLowerCase().includes(searchTerm.toLowerCase())       ||
                                                                                         process.gapstItemEditorial.toLowerCase().includes(searchTerm.toLowerCase())   ||
                                                                                         process.gapstItemCode.toLowerCase().includes(searchTerm.toLowerCase())   ||
                                                                                         process.gapstCity.toLowerCase().includes(searchTerm.toLowerCase())     );
                } else {
                    filteredGapSourceStock = filteredGapSourceStock.filter(process => filterOptions.includes(process.gapstFormat));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: process.message,
                gapsSourceStock: filteredGapSourceStock
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: gapsSourceStock.status,
                mensaje: gapsSourceStock.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const bulkLoadStock = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const result = await GapSourceStockModel.bulkLoadStock(req.body);

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
    getAllGapSourceStockByParameters,
    bulkLoadStock,
};