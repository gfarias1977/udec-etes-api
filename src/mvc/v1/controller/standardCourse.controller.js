const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const StandardCourseModel = require('../model/standardCourse.model');

const getAllStandardCourses = async( req, res, next ) => {

    try {

        const standardCourses = await StandardCourseModel.getAllStandardCourses( );

        if(standardCourses.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: standardCourses.message,
                standardCourses: standardCourses.standardCourses
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: standardCourses.status,
                mensaje: standardCourses.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getAllStandardCoursesByUserId = async( req, res, next ) => {

    try {
        const stdcUserId = req.query.stdcUserId;
        const stdcStdCode = req.query.stdcStdCode;
        let stdcPurcCode = req.query.stdcPurcCode;
        const stdcVersion = req.query.stdcVersion;

        if (typeof stdcPurcCode == "undefined") {
            stdcPurcCode = null;
        } 
        const standardCourses = await StandardCourseModel.getAllStandardCoursesByUserId( stdcUserId, stdcStdCode, stdcPurcCode, stdcVersion );

        if(standardCourses.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: standardCourses.message,
                standardCourses: standardCourses.standardCourses
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: standardCourses.status,
                mensaje: standardCourses.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getStandardCourseByStandardUserId = async( req, res, next ) => {

    try {
        let stdcPurcCode = req.query.stdcPurcCode;
        const stdcStdCode= req.query.stdcStdCode;
        const stdcOrgCode= req.query.stdcOrgCode;
        const stdcBuCode= req.query.stdcBuCode;
        const stdcVersion= req.query.stdcVersion;
        const stdcYear= req.query.stdcYear;
        const stdcUserId= req.userId;

        if (typeof stdcPurcCode == "undefined") {
            stdcPurcCode = null;
        } 
        const standardCourses = await StandardCourseModel.getStandardCourseByStandardUserId( stdcStdCode, stdcOrgCode, stdcBuCode, stdcPurcCode, stdcVersion, stdcYear, stdcUserId );

        //let strJsonResponse=JSON.stringify(standardCourses.standardCourses[0]);
        //let standardCoursesStr = strJsonResponse.replace("\"", "");
        //console.log(standardCoursesStr);

        if(standardCourses.type === 'ok'){

           // let strJsonResponde=JSON.stringify(standardCourses.standardCourses);
            //standardCourses = strJsonResponde.replace(/\\/g, '');

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: standardCourses.message,
                standardCourses: standardCourses.standardCourses
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: standardCourses.status,
                mensaje: standardCourses.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getStandardCourseById = async( req, res, next ) => {

    const stdcStdCode= req.query.stdcStdCode;
    const stdcOrgCode= req.query.stdcOrgCode;
    const stdcBuCode= req.query.stdcBuCode;
    const stdcPurcCode= req.query.stdcPurcCode; 
    const stdcCoursCode= req.query.stdcCoursCode;
    const stdcRlayCode= req.query.stdcRlayCode;
    const stdcItemCode= req.query.stdcItemCode;
    const stdcVersion= req.query.stdcVersion;
    const stdcSchoCode= req.query.stdcSchoCode;
    
    
    const standardCourse = await StandardCourseModel.getStandardCourseById(stdcStdCode, stdcOrgCode,stdcBuCode, stdcPurcCode, stdcCoursCode, stdcRlayCode, stdcItemCode, stdcVersion, stdcSchoCode );
    
    if(standardCourse){
        res.status(200).send({
            type: 'ok',
            status: 200,
            standardCourse: standardCourse
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Estandar no encontrado'
        });
    };

};

const getStandardCourseBySearch = async( req, res, next ) => {

    try { 
        let stdcStdCode= req.query.stdcStdCode;   
        let stdcOrgCode= req.query.stdcOrgCode;
        let stdcBuCode= req.query.stdcBuCode;
        let stdcPurcCode= req.query.stdcPurcCode; 
        let stdcCoursCode= req.query.stdcCoursCode;
        let stdcRlayCode= req.query.stdcRlayCode;
        let stdcItemCode= req.query.stdcItemCode;
        let stdcStdVersion= req.query.stdcStdVersion;
        let stdcSchoCode= req.query.stdcSchoCode;

        if (typeof stdcStdCode == "undefined") {
            stdcStdCode = null;
        }
        if (typeof stdcOrgCode == "undefined") {
            stdcOrgCode = null;
        }
        if (typeof stdcBuCode == "undefined") {
            stdcBuCode = null;
        }        
        if (typeof stdcPurcCode == "undefined") {
            stdcPurcCode = null;
        }
        if (typeof stdcCoursCode == "undefined") {
            stdcCoursCode = null;
        }               
        if (typeof stdcRlayCode == "undefined") {
            stdcRlayCode = null;
        }   
        if (typeof stdcItemCode == "undefined") {
            stdcItemCode = null;
        }         
        if (typeof stdcVersion == "undefined") {
            stdcVersion = null;
        }         
        if (typeof stdcSchoCode == "undefined") {
            stdcSchoCode = null;
        }                                                   
        
        const standardCourses = await StandardCourseModel.getStandardCourseBySearch(stdcStdCode, stdcOrgCode, stdcBuCode, stdcPurcCode, stdcCoursCode, stdcRlayCode, stdcItemCode, stdcStdVersion, stdcSchoCode);
        
        if(standardCourses.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: standardCourses.message,
                standardCourses: standardCourses.standardCourses
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: standardCourses.status,
                mensaje: standardCourses.message
            });
        };
    } catch (error) {
        next();
    };
};

const createStandardCourse = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {stdcStdCode, stdcOrgCode, stdcBuCode, stdcStdVersion, stdcCoursCode, stdcRlayCode, stdcPurcCode, stdcItemCode, stdcSchoCode } = req.body;
        const standardCourseExist = await StandardCourseModel.standardCourseExist( stdcStdCode, stdcOrgCode, stdcBuCode, stdcStdVersion, stdcCoursCode, stdcRlayCode, stdcPurcCode, stdcItemCode, stdcSchoCode);
        
        if( standardCourseExist.type === 'error' ){
            throw new HttpException(500, standardCourseExist.message );
        };
        
        const result = await StandardCourseModel.createStandardCourse(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Estandar Asignatura ha sido creado!'
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

const updateStandardCourse = async( req, res, next ) =>{

    const stdcStdCode= req.query.stdcStdCode;   
    const stdcOrgCode= req.query.stdcOrgCode;
    const stdcBuCode= req.query.stdcBuCode;
    const stdcPurcCode= req.query.stdcPurcCode; 
    const stdcCoursCode= req.query.stdcCoursCode;
    const stdcRlayCode= req.query.stdcRlayCode;
    const stdcItemCode= req.query.stdcItemCode;
    const stdcStdVersion= req.query.stdcStdVersion;
    const stdcSchoCode= req.query.stdcSchoCode;

    const homologa = {
        'stdcPerformance'     :  'stdc_performance',
        'stdcRenewalCicle'    :  'stdc_renewal_cicle',        
        'stdcMaintenanceCicle':  'stdc_maintenance_cicle',
        'stdcDetail'          :  'stdc_detail',        
        'stdcStatus'          :  'stdc_status'
    };

    checkValidation(req);

    const {stdc_performance, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await StandardCourseModel.updateStandardCourse(newRestOfUpdates[0],  req.query.stdcStdCode, req.query.stdcOrgCode, req.query.stdcBuCode, req.query.stdcStdVersion, req.query.stdcCoursCode, req.query.stdcRlayCode, req.query.stdcPurcCode, req.query.stdcItemCode, req.query.stdcSchoCode);

    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Estandar Asignatura Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Estandar Asignatura no se pudo actualizar'
        });
    };

};


const deleteStandardCourse = async (req, res, next) => {
    
    const stdcStdCode= req.query.stdcStdCode;   
    const stdcOrgCode= req.query.stdcOrgCode;
    const stdcBuCode= req.query.stdcBuCode;
    const stdcPurcCode= req.query.stdcPurcCode; 
    const stdcCoursCode= req.query.stdcCoursCode;
    const stdcRlayCode= req.query.stdcRlayCode;
    const stdcItemCode= req.query.stdcItemCode;
    const stdcStdVersion= req.query.stdcStdVersion;
    const stdcSchoCode= req.query.stdcSchoCode;

    const result = await StandardCourseModel.deleteStandardCourse(stdcStdCode, stdcOrgCode, stdcBuCode, stdcStdVersion, stdcCoursCode, stdcRlayCode, stdcPurcCode, stdcItemCode, stdcSchoCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 200,
        message: 'Estandar ha sido eliminado!'
    });
};


const deleteStandardCourseByRlayCourseCode = async (req, res, next) => {
    
    const { stdcStdCode, stdcOrgCode, stdcPurcCode, stdcBuCode, stdcCoursCode, stdcRlayCode, stdcStdVersion } = req.query;

    const result = await StandardCourseModel.deleteStandardCourseByRlayCourseCode( stdcStdCode, stdcOrgCode, stdcPurcCode, stdcBuCode, stdcCoursCode, stdcRlayCode, stdcStdVersion );

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 200,
        message: 'Estandar ha sido eliminado!'
    });
};

checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllStandardCourses,
    getAllStandardCoursesByUserId,
    getStandardCourseByStandardUserId,
    getStandardCourseById,
    getStandardCourseBySearch,
    createStandardCourse,
    updateStandardCourse,
    deleteStandardCourse,
    deleteStandardCourseByRlayCourseCode
};