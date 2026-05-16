const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const FacultyModel = require('../model/faculty.model');

const getAllFaculties = async( req, res, next ) => {

    try {
        const faculties = await FacultyModel.getAllFaculties();

        if(faculties.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: faculties.message,
                faculties: faculties.faculties
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: faculties.status,
                mensaje: faculties.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getFacultyById = async( req, res, next ) => {

    const facuCode = req.query.facuCode;

    const faculty = await FacultyModel.getFacultyById( facuCode );
    
    if(faculty){
        res.status(200).send({
            type: 'ok',
            status: 200,
            faculty: faculty
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Facultad no encontrada'
        });
    };

};


const getAllFacultysByName = async( req, res, next ) => {

    const facuName = req.query.facuName;
    try {

        const faculties = await FacultyModel.getAllFacultyByName( facuName );

        if(faculties.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: faculties.message,
                faculties: faculties.faculties
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: faculties.status,
                mensaje: faculties.message
            });
        };
    } catch (error) {
        next();
    };
};

const createFaculty = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {facuCode} = req.body;
        const facultyExist = await FacultyModel.facultyExists( facuCode );
        
        if( facultyExist.type === 'error' ){
            throw new HttpException(500, facultyExist.message );
        };
        
        const result = await FacultyModel.createFaculty(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Facultad ha sido creada!'
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

const updateFaculty = async( req, res, next ) =>{

    const homologa = {

        'facuOrgCode'      :'facu_org_code',
        'facuName'         :'facu_name',
        'facuStatus'       :'facu_status',  
    };

    checkValidation(req);

    const {facu_org_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await FacultyModel.updateFaculty(newRestOfUpdates[0], req.query.facuCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Facultad Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Facultad no se pudo actualizar'
        });
    };

};

const deleteFaculty = async (req, res, next) => {
    
    const facuCode = req.query.facuCode;

    const result = await FacultyModel.deleteFaculty(facuCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Facultad ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllFaculties,
    getFacultyById,
    getAllFacultysByName,
    createFaculty,
    updateFaculty,
    deleteFaculty
};