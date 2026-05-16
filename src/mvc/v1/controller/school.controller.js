const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const SchoolModel = require('../model/school.model');

const getAllSchools = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm } = req.query;
        const schools = await SchoolModel.getAllSchools();

        if(schools.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredSchools = schools.schools;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredSchools = filteredSchools.filter(
                        school =>  school.schoDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes( school.schoStatus) ||
                                   school.schoOrgCode.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes( school.schoStatus) ||
                                   school.schoBuCode.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes( school.schoStatus)
                        );
                } else if (searchTerm) {
                    filteredSchools = filteredSchools.filter( school =>  school.schoDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    school.schoOrgCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    school.schoBuCode.toLowerCase().includes(searchTerm.toLowerCase())   );
                } else {
                    filteredSchools = filteredSchools.filter( school => filterOptions.includes( school.schoStatus));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: schools.message,
                schools: filteredSchools//schools.schools
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: schools.status,
                mensaje: schools.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getSchoolById = async( req, res, next ) => {

    const schoCode = req.query.schoCode;
    const schoOrgCode = req.query.schoOrgCode;

    const school = await SchoolModel.getSchoolById( schoCode, schoOrgCode );
    
    if(school){
        res.status(200).send({
            type: 'ok',
            status: 200,
            school: school
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Unidad Academica no encontrada'
        });
    };

};


const getAllSchoolsByName = async( req, res, next ) => {

    const schoDescription = req.query.schoDescription;
    try {

        const schools = await SchoolModel.getAllSchoolsByName( schoDescription );

        if(schools.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: schools.message,
                schools: schools.schools
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: schools.status,
                mensaje: schools.message
            });
        };
    } catch (error) {
        next();
    };
};

const getAllSchoolsByOrgCode = async( req, res, next ) => {
   
    const schoOrgCode   = req.query.schoOrgCode;
    const schoCaccCode = req.query.schoCaccCode;

    try {
        const schools = await SchoolModel.getAllSchoolsByOrgCode(schoOrgCode, schoCaccCode);

        if(schools.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: schools.message,
                schools: schools.schools 
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: schools.status,
                mensaje: schools.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const createSchool = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {schoCode} = req.body;
        const {schoOrgCode} = req.body;
        const schoolExist = await SchoolModel.schoolExists( schoCode, schoOrgCode );
        
        if( schoolExist.type === 'error' ){
            throw new HttpException(500, schoolExist.message );
        };
        
        const result = await SchoolModel.createSchool(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Unidad Academica ha sido creada!'
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

const updateSchool = async( req, res, next ) =>{

    const homologa = {
        'schoCaccCode'     :'scho_cacc_code',   
        'schoBuCode'       :'scho_bu_code',     
        'schoDescription'  :'scho_description',
        'schoStatus'       :'scho_status'   
    };

    checkValidation(req);

    const {scho_cacc_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await SchoolModel.updateSchool(newRestOfUpdates[0], req.query.schoCode, req.query.schoOrgCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Unidad Academica Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Unidad Academica no se pudo actualizar'
        });
    };

};

const deleteSchool = async (req, res, next) => {
    
    const schoCode = req.query.schoCode;
    const schoOrgCode = req.query.schoOrgCode;
    

    const result = await SchoolModel.deleteSchool(schoCode, schoOrgCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Unidad Academica ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllSchools,
    getSchoolById,
    getAllSchoolsByName,
    getAllSchoolsByOrgCode,
    createSchool,
    updateSchool,
    deleteSchool
};