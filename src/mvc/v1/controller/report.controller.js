const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ReportModel = require('../model/report.model');

const getReportStandardAppliedToMayor = async( req, res, next ) => {
    try {
        const {filterOptions, searchTerm, buCode, stdCode, purcCode, stdVersion, majorCode} = req.body;
        const report = await ReportModel.getReportStandardAppliedToMayor(buCode, stdCode, purcCode, stdVersion, majorCode);

        if(report.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredReport = report.report;

            if ( searchTerm || filterLength > 0) {
                if (searchTerm ) {
                    filteredReport = filteredReport.filter(data => 
                                                                data.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) 
                                                            ||  data.courseDescription.toString().includes(searchTerm.toLowerCase())
                                                            ||  data.courseDuration.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  data.itemCode.toString().includes(searchTerm.toLowerCase())
                                                            ||  data.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  data.stdcRlayCode.toLowerCase().includes(searchTerm.toLowerCase())                                                            
                                                            ||  data.rlayDescription.toString().includes(searchTerm.toLowerCase()));
                } 
                if (filterLength > 0){
                    filteredReport = filteredReport.filter(data => filterOptions.includes(data.coursStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: report.message,
                report: filteredReport
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: report.status,
                mensaje: report.message
            });
        };
    } catch (error) {
        next();
    };
   
};


const getReportStandardByRoomLayout = async( req, res, next ) => {
    try {
        const {filterOptions, searchTerm, buCode, stdCode, purcCode, stdVersion, rlayCode} = req.body;
        const report = await ReportModel.getReportStandardByRoomLayout(buCode, stdCode, purcCode, stdVersion, rlayCode);

        if(report.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredReport = report.report;

            if ( searchTerm || filterLength > 0) {
                if (searchTerm ) {
                    filteredReport = filteredReport.filter(data => 
                                                                data.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) 
                                                            ||  data.courseDescription.toString().includes(searchTerm.toLowerCase())
                                                            ||  data.courseDuration.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  data.itemCode.toString().includes(searchTerm.toLowerCase())
                                                            ||  data.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  data.quantity.toLowerCase().includes(searchTerm.toLowerCase())  
                                                            ||  data.itemUnitValue.toLowerCase().includes(searchTerm.toLowerCase()) 
                                                            ||  data.inversion.toLowerCase().includes(searchTerm.toLowerCase())   
                                                            ||  data.stdcMaintenanceCicle.toLowerCase().includes(searchTerm.toLowerCase())   
                                                            ||  data.stdcRlayCode.toLowerCase().includes(searchTerm.toLowerCase())    
                                                            ||  data.rlayCapacity.toLowerCase().includes(searchTerm.toLowerCase())    
                                                            ||  data.rlayDescription.toLowerCase().includes(searchTerm.toLowerCase())                                                         
                                                            ||  data.stdcRenewalCicle.toString().includes(searchTerm.toLowerCase()));
                } 
                if (filterLength > 0){
                    filteredReport = filteredReport.filter(data => filterOptions.includes(data.coursStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: report.message,
                report: filteredReport
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: report.status,
                mensaje: report.message
            });
        };
    } catch (error) {
        next();
    };
   
};


const getReportEquipmentByMayor = async( req, res, next ) => {
    try {
        const {filterOptions, searchTerm, majorCode, progCode, buCode} = req.body;
        const report = await ReportModel.getReportEquipmentByMayor(majorCode, progCode, buCode);

        if(report.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredReport = report.report;

            if ( searchTerm || filterLength > 0) {
                if (searchTerm ) {
                    filteredReport = filteredReport.filter(data => 
                                                                data.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) 
                                                            ||  data.courseDescription.toString().includes(searchTerm.toLowerCase())
                                                            ||  data.itemCode.toString().includes(searchTerm.toLowerCase())
                                                            ||  data.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  data.quantity.toLowerCase().includes(searchTerm.toLowerCase())  
                                                            ||  data.itemUnitValue.toLowerCase().includes(searchTerm.toLowerCase()) 
                                                            ||  data.inversion.toLowerCase().includes(searchTerm.toLowerCase())   
                                                            ||  data.stdcMaintenanceCicle.toLowerCase().includes(searchTerm.toLowerCase())                                                        
                                                            ||  data.stdcRenewalCicle.toString().includes(searchTerm.toLowerCase()));
                } 
                if (filterLength > 0){
                    filteredReport = filteredReport.filter(data => filterOptions.includes(data.coursStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: report.message,
                report: filteredReport
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: report.status,
                mensaje: report.message
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
    getReportStandardAppliedToMayor,
    getReportStandardByRoomLayout,
    getReportEquipmentByMayor
};