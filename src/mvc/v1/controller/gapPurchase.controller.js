const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const GapPurchaseModel = require('../model/gapPurchase.model');

const getAllGapPurchasesByParameters= async( req, res, next ) => {

    try {
        const { 
            filterOptions, 
            searchTerm, 
            gapProcId,
            gapProcCode,
            gapYear,
            gapPeriod,
            gapOrgCode,
            gapCampCode,
            gapSchoCode,
            gapCoursCode,
            gapItemCode,
            gapVolume,
            gapCityCode} = req.query;

        const gapPurchases = await GapPurchaseModel.getAllGapPurchasesByParameters(
            gapProcId,
            gapProcCode,
            gapYear,
            gapPeriod,
            gapOrgCode,
            gapCampCode,
            gapSchoCode,
            gapCoursCode,
            gapItemCode,
            gapVolume,
            gapCityCode);

        if(gapPurchases.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredPurchases = gapPurchases.gapPurchases;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredPurchases = filteredPurchases.filter(
                        gapPurchase  => gapPurchase.gappdSchoDescription.toLowerCase().includes(searchTerm.toLowerCase())     && filterOptions.includes(gapPurchase.gappdItemStatus) ||
                                        gapPurchase.gappdCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())    && filterOptions.includes(gapPurchase.gappdItemStatus) ||
                                        gapPurchase.gappdCampDescription.toLowerCase().includes(searchTerm.toLowerCase())     && filterOptions.includes(gapPurchase.gappdItemStatus) ||
                                        gapPurchase.gappdTitle.toLowerCase().includes(searchTerm.toLowerCase())               && filterOptions.includes(gapPurchase.gappdItemStatus) ||
                                        gapPurchase.gappdCityCode.toLowerCase().includes(searchTerm.toLowerCase())            && filterOptions.includes(gapPurchase.gappdItemStatus)  );
                } else if (searchTerm) {
                    filteredPurchases = filteredPurchases.filter(
                        gapPurchase =>    
                                        gapPurchase.gappdSchoDescription.toLowerCase().includes(searchTerm.toLowerCase())       || 
                                        gapPurchase.gappdCoursDescription.toLowerCase().includes(searchTerm.toLowerCase())      || 
                                        gapPurchase.gappdCampDescription.toLowerCase().includes(searchTerm.toLowerCase())       ||
                                        gapPurchase.gappdTitle.toLowerCase().includes(searchTerm.toLowerCase())                 ||
                                        gapPurchase.gappdCityCode.toLowerCase().includes(searchTerm.toLowerCase())     );
                } else {
                    filteredPurchases = filteredPurchases.filter(gapPurchase => filterOptions.includes(gapPurchase.gappdItemStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: gapPurchases.message,
                gapPurchases: filteredPurchases
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: gapPurchases.status,
                mensaje: gapPurchases.message
            });
        };
    } catch (error) {
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
    getAllGapPurchasesByParameters

};