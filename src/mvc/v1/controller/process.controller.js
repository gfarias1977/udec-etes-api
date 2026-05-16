const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ProcessModel = require('../model/process.model');

const getAllProcessByPurcCode= async( req, res, next ) => {

    try {
        let { filterOptions, searchTerm, proctId, purcCode } = req.query;
        const processes = await ProcessModel.getAllProcessByPurcCode(proctId, purcCode);
        if(filterOptions === undefined) filterOptions = [];
        if(searchTerm === undefined) searchTerm = '';

        if(processes.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredProcesses = processes.processes;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredProcesses = filteredProcesses.filter(
                        process  =>       process.procEmailNotification.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(process.procStatus) ||
                                          process.procFile.toLowerCase().includes(searchTerm.toLowerCase())              && filterOptions.includes(process.procStatus) ||
                                          process.procCode.toLowerCase().includes(searchTerm.toLowerCase())              && filterOptions.includes(process.procStatus) ||
                                          process.procId.toLowerCase().includes(searchTerm.toLowerCase())                && filterOptions.includes(process.procStatus) ||
                                          process.procScheduledDate.toLowerCase().includes(searchTerm.toLowerCase())     && filterOptions.includes(process.procStatus)  );
                } else if (searchTerm) {
                    filteredProcesses = filteredProcesses.filter(process =>    process.procEmailNotification.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                                               process.procFile.toLowerCase().includes(searchTerm.toLowerCase())              || 
                                                                               process.procCode.toLowerCase().includes(searchTerm.toLowerCase())              ||
                                                                               process.procId.toLowerCase().includes(searchTerm.toLowerCase())                ||
                                                                               process.procScheduledDate.toLowerCase().includes(searchTerm.toLowerCase())     );
                } else {
                    filteredProcesses = filteredProcesses.filter(process => filterOptions.includes(process.procStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: process.message,
                processes: filteredProcesses
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: process.status,
                mensaje: process.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const createProcess = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {procCode} = req.body;
        const procExist = await ProcessModel.Exist( procCode );
        
        if( procExist.type === 'error' ){
            throw new HttpException(500, procExist.message );
        };
        
        const result = await ProcessModel.createProcess(req.body);

        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Proceso ha sido creado!'
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

const updateProcess = async( req, res, next ) =>{

    const homologa = {
        'procPurcCode'         :'proc_purc_code',          
        'procProctId'          :'proc_proct_id',
        'procScheduledDate'    :'proc_scheduled_date',
        'procEmailNotification':'proc_email_notification',
        'procCode'             :'proc_code',
        'procFile'             :'proc_file',
        'procFileUploaded'     :'proc_file_uploaded',
        'procCreationDate'     :'proc_creation_date',
        'procStatus'           :'proc_status',
        'procMsg'              :'proc_msg'
    };

    checkValidation(req);

    const {proc_purc_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ProcessModel.updateProcess(newRestOfUpdates[0], req.query.procCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Proceso Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Proceso no se pudo actualizar'
        });
    };

};

const deleteProcess = async (req, res, next) => {
    
    const procId = req.query.procId;

    const result = await ProcessModel.deleteProcess(procId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Programacion ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllProcessByPurcCode,
    createProcess,
    updateProcess,
    deleteProcess
};