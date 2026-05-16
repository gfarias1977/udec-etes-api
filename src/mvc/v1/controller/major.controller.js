const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const MajorModel = require('../model/major.model');

const getAllMajors = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm, filterSelectOrgCode, filterSelectPurcCode } = req.query;
        const majors = await MajorModel.getAllMajors();

        if(majors.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredMajors = majors.majors;

            if (searchTerm || filterSelectOrgCode || filterSelectPurcCode || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredMajors = filteredMajors.filter(
                    major => major.majorDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(major.majorStatus) ||
                             major.majorOrgCode.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(major.majorStatus));
                } else if (searchTerm) {
                    filteredMajors = filteredMajors.filter(major => major.majorDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                                    major.majorOrgCode.toLowerCase().includes(searchTerm.toLowerCase()));
                } else if (filterSelectOrgCode && filterSelectPurcCode ) {
                    filteredMajors = filteredMajors.filter(major => major.purcCode.toLowerCase().includes(filterSelectPurcCode.toLowerCase()) || 
                                                                    major.majorOrgCode.toLowerCase().includes(filterSelectOrgCode.toLowerCase()));
                } else {
                    filteredMajors = filteredMajors.filter(major => filterOptions.includes(major.majorStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: majors.message,
                majors: filteredMajors//majors.majors
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: majors.status,
                mensaje: majors.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getMajors = async( req, res, next ) => {

    try {
        let { filterOptions, searchTerm, filterSelect } = req.query;
        if(filterOptions === undefined) filterOptions = [];
        if(searchTerm === undefined) searchTerm = '';
        if(filterSelect === undefined) filterSelect = '';


        const majors = await MajorModel.getMajors();

        if(majors.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredMajors = majors.majors;

            if (searchTerm || filterSelect || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredMajors = filteredMajors.filter(
                    major => major.majorDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(major.majorStatus) ||
                             major.majorOrgCode.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(major.majorStatus));
                } else if (searchTerm) {
                    filteredMajors = filteredMajors.filter(major => major.majorDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                                    major.majorOrgCode.toLowerCase().includes(searchTerm.toLowerCase()));
                } else if (filterSelect) {
                    filteredMajors = filteredMajors.filter(major => major.majorOrgCode.toLowerCase().includes(filterSelect.toLowerCase()));
                } else {
                    filteredMajors = filteredMajors.filter(major => filterOptions.includes(major.majorStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: majors.message,
                majors: filteredMajors//majors.majors
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: majors.status,
                mensaje: majors.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getMajorById = async( req, res, next ) => {

    const majorCode = req.query.majorCode;

    const major = await MajorModel.getMajorById( majorCode );
    
    if(major){
        res.status(200).send({
            type: 'ok',
            status: 200,
            major: major
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Carrera no encontrada'
        });
    };

};


const getAllMajorsByName = async( req, res, next ) => {

    const majorDescription = req.query.majorDescription;
    try {

        const majors = await MajorModel.getAllMajorsByName( majorDescription );

        if(majors.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: majors.message,
                majors: majors.majors
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: majors.status,
                mensaje: majors.message
            });
        };
    } catch (error) {
        next();
    };
};

const createMajor = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {majorCode} = req.body;
        const majorExist = await MajorModel.majorExist( majorCode );
        
        if( majorExist.type === 'error' ){
            throw new HttpException(500, majorExist.message );
        };
        
        const result = await MajorModel.createMajor(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Carrera ha sido creada!'
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

const updateMajor = async( req, res, next ) =>{

    const homologa = {
        'majorOrgCode'         :'major_org_code',
        'majorSchoolCode'      :'major_school_code',
        'majorCaccCode'        :'major_cacc_code',
        'majorLevelCode'       :'major_level_code',
        'majorShortDescription':'major_short_description',
        'majorDescription'     :'major_description',
        'majorStatus'          :'major_status'
    };

    checkValidation(req);

    const {major_org_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await MajorModel.updateMajor(newRestOfUpdates[0], req.query.majorCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Carrera Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Carrera no se pudo actualizar'
        });
    };

};

const deleteMajor = async (req, res, next) => {
    
    const majorCode = req.query.majorCode;

    const result = await MajorModel.deleteMajor(majorCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Carrera ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllMajors,
    getMajors,
    getMajorById,
    getAllMajorsByName,
    createMajor,
    updateMajor,
    deleteMajor
};