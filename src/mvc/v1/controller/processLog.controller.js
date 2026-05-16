const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ProcessLogModel = require('../model/processLog.model');

const getAllProcessLog= async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm, procId } = req.query;
        const processLogs = await ProcessLogModel.getAllProcessLog(procId);

        if(processesLog.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredProcessLogs = processLogs.processLogs;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredProcessLogs = filteredProcessLogs.filter(
                        processLog  =>    processLog.procEmailNotification.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(processLog.procStatus) ||
                                          processLog.procFile.toLowerCase().includes(searchTerm.toLowerCase())              && filterOptions.includes(processLog.procStatus) ||
                                          processLog.procCode.toLowerCase().includes(searchTerm.toLowerCase())              && filterOptions.includes(processLog.procStatus) ||
                                          processLog.procId.toLowerCase().includes(searchTerm.toLowerCase())                && filterOptions.includes(processLog.procStatus) ||
                                          processLog.procScheduledDate.toLowerCase().includes(searchTerm.toLowerCase())     && filterOptions.includes(processLog.procStatus)  );
                } else if (searchTerm) {
                    filteredProcessLogs = filteredProcessLogs.filter(processLog =>    processLog.procEmailNotification.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                                               processLog.procFile.toLowerCase().includes(searchTerm.toLowerCase())              || 
                                                                               processLog.procCode.toLowerCase().includes(searchTerm.toLowerCase())              ||
                                                                               processLog.procId.toLowerCase().includes(searchTerm.toLowerCase())                ||
                                                                               processLog.procScheduledDate.toLowerCase().includes(searchTerm.toLowerCase())     );
                } else {
                    filteredProcessLogs = filteredProcessLogs.filter(processLog => filterOptions.includes(processLog.procStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: processLogs.message,
                processLogs: filteredProcessLogs
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: processLogs.status,
                mensaje: processLogs.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const createProcessLog = async (req, res, next) => {
    checkValidation(req);

    try {
        
       
        const result = await ProcessLogModel.createProcessLog(req.body);

        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Proceso Log ha sido creado!'
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

const deleteProcessLog = async (req, res, next) => {
    
    const procId = req.query.procId;

    const result = await ProcessLogModel.deleteProcessLog(procId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Programacion Log ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllProcessLog,
    createProcessLog,
    deleteProcessLog
};