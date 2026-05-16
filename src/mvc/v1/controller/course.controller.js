const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const CourseModel = require('../model/course.model');

const getAllCourses = async( req, res, next ) => {
    try {
        const {filterOptions, searchTerm} = req.query;
        const courses = await CourseModel.getAllCourses();

        if(courses.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredCourses = courses.courses;

            if ( searchTerm || filterLength > 0) {
                if (searchTerm ) {
                    filteredCourses = filteredCourses.filter(course => 
                                                                course.coursDescription.toLowerCase().includes(searchTerm.toLowerCase()) 
                                                            ||  course.itemItmcSubFamCode.toString().includes(searchTerm.toLowerCase())
                                                            ||  course.itemItmcSubFamName.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  course.itemItmcFamCode.toString().includes(searchTerm.toLowerCase())
                                                            ||  course.itemItmcFamName.toLowerCase().includes(searchTerm.toLowerCase())
                                                            ||  course.itemCode.toString().includes(searchTerm.toLowerCase()));
                } 
                if (filterLength > 0){
                    filteredCourses = filteredCourses.filter(course => filterOptions.includes(course.coursStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: courses.message,
                courses: filteredCourses
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: courses.status,
                mensaje: courses.message
            });
        };
    } catch (error) {
        next();
    };
   
};

const getAllCoursesByOrgCodeAndSchoCode = async( req, res, next ) => {

    try {
        const {orgCode, schoCode} = req.query;
        const courses = await CourseModel.getAllCoursesByOrgCodeAndSchoCode(orgCode, schoCode);

        if(courses.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: courses.message,
                courses: courses.courses
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: courses.status,
                mensaje: courses.message
            });
        };
    } catch (error) {
        next();
    };
    
};


const getCourseById = async( req, res, next ) => {

    const coursCode = req.query.coursCode;

    const course = await CourseModel.getCourseById( coursCode );
    
    if(course){
        res.status(200).send({
            type: 'ok',
            status: 200,
            course: course
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Carrera no encontrada'
        });
    };

};


const getAllCoursesByName = async( req, res, next ) => {

    const coursDescription = req.query.coursDescription;
    try {

        const courses = await CourseModel.getAllCourseByName( coursDescription );

        if(courses.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: courses.message,
                courses: courses.courses
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: courses.status,
                mensaje: courses.message
            });
        };
    } catch (error) {
        next();
    };
};

const createCourse = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {coursCode} = req.body;
        const courseExist = await CourseModel.courseExists( coursCode );
        
        if( courseExist.type === 'error' ){
            throw new HttpException(500, courseExist.message );
        };
        
        const result = await CourseModel.createCourse(req.body);
        
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

const updateCourse = async( req, res, next ) =>{

    const homologa = {
        'coursOrgCode'         :'cours_org_code',
        'coursSchoCode'        :'cours_scho_code',
        'coursShortDescription':'cours_short_description',
        'coursDescription'     :'cours_description',
        'coursType'            :'cours_type',
        'coursMethod'          :'cours_method',
        'coursDuration'        :'cours_duration',
        'coursModality'        :'cours_modality',
        'coursElearning'       :'cours_elearning',
        'coursClinicalField'   :'cours_clinical_field',
        'coursStatus'          :'cours_status'
    };

    checkValidation(req);

    const {cours_org_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await CourseModel.updateCourse(newRestOfUpdates[0], req.query.coursCode);
    
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

const deleteCourse = async (req, res, next) => {
    
    const coursCode = req.query.coursCode;

    const result = await CourseModel.deleteCourse(coursCode);

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
    getAllCourses,
    getAllCoursesByOrgCodeAndSchoCode,
    getCourseById,
    getAllCoursesByName,
    createCourse,
    updateCourse,
    deleteCourse
};