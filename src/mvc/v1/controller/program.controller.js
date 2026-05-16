const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const ProgramModel = require('../model/program.model');

const getAllPrograms = async( req, res, next ) => {

    try {
        let { filterOptions, searchTerm, filterSelect } = req.query;
        const programs = await ProgramModel.getAllPrograms();
        if(filterOptions === undefined) filterOptions = [];
        if(searchTerm === undefined) searchTerm = '';
        if(filterSelect === undefined) filterSelect = '';

        if(programs.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredPrograms = programs.programs;

            if (searchTerm || filterSelect || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredPrograms = filteredPrograms.filter(
                    program => program.progTitle.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(program.progStatus));
                } else if (searchTerm) {
                    filteredPrograms = filteredPrograms.filter(program => program.progTitle.toLowerCase().includes(searchTerm.toLowerCase()));
                } else if (filterSelect) {
                    filteredPrograms = filteredPrograms.filter(program => program.progMajorCode.toLowerCase().includes(filterSelect.toLowerCase()));
                } else {
                    filteredPrograms = filteredPrograms.filter(program => filterOptions.includes(program.progStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: programs.message,
                programs: filteredPrograms //programs.programs
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: programs.status,
                mensaje: programs.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getProgramById = async( req, res, next ) => {

    const progCode      = req.query.progCode;
    const progMajorCode = req.query.progMajorCode;

    const program = await ProgramModel.getProgramById( progCode, progMajorCode );
    
    if(program){
        res.status(200).send({
            type: 'ok',
            status: 200,
            program: program
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Plan no encontrado'
        });
    };

};


const getAllProgramsByName = async( req, res, next ) => {

    const progName = req.query.progName;
    try {

        const programs = await ProgramModel.getAllProgramsByName( progName );

        if(programs.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: programs.message,
                programs: programs.programs
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: programs.status,
                mensaje: programs.message
            });
        };
    } catch (error) {
        next();
    };
};


const createProgram = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {progCode,progMajorCode} = req.body;
        const programExist = await ProgramModel.programExist( progCode, progMajorCode );
        
        if( programExist.type === 'error' ){
            throw new HttpException(500, programExist.message );
        };
        
        const result = await ProgramModel.createProgram(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Plan ha sido creado!'
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

const updateProgram = async( req, res, next ) =>{

    const homologa = {
        'progProtCode'        : 'prog_prot_code',         
        'progPropCode'        : 'prog_prop_code',
        'progYear'            : 'prog_year',
        'progMajorName'       : 'prog_major_name',
        'progTitle'           : 'prog_title',
        'progDegre'          : 'prog_degre',
        'progBachelor'        : 'prog_bachelor',
        'progLevel'           : 'prog_level',            
        'progRegistrationDate': 'prog_registration_date',
        'progStatus'          : 'prog_status'	
    };

    checkValidation(req);

    const {prog_prot_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await ProgramModel.updateProgram(newRestOfUpdates[0], req.query.progCode, req.query.progMajorCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Plan Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Plan no se pudo actualizar'
        });
    };

};

const deleteProgram = async (req, res, next) => {
    
    const progCode = req.query.progCode;
    const progMajorCode = req.query.progMajorCode;
    

    const result = await ProgramModel.deleteProgram(progCode, progMajorCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Plan ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllPrograms,
    getProgramById,
    getAllProgramsByName,
    createProgram,
    updateProgram,
    deleteProgram
};