const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const CampusModel = require('../model/campus.model');

const getAllCampus = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm, orgCode } = req.query;
        const campus =  await CampusModel.getAllCampus(orgCode);

        if(campus.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredCampus = campus.campus;

            if(orgCode){
                filteredCampus = filteredCampus.filter(campus => campus.campOrgCode.toLowerCase().includes(orgCode.toLowerCase()));
            }

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredCampus = filteredCampus.filter(
                    campus => campus.campDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(campus.campStatus) ||
                              campus.campAddress.toLowerCase().includes(searchTerm.toLowerCase())     && filterOptions.includes(campus.campStatus) ||
                              campus.campDeparment.toLowerCase().includes(searchTerm.toLowerCase())   && filterOptions.includes(campus.campStatus) ||
                              campus.campCity.toLowerCase().includes(searchTerm.toLowerCase())        && filterOptions.includes(campus.campStatus) ||
                              campus.campType.toLowerCase().includes(searchTerm.toLowerCase())        && filterOptions.includes(campus.campStatus) ||
                              campus.campOrgCode.toLowerCase().includes(searchTerm.toLowerCase())     && filterOptions.includes(campus.campStatus));
                } else if (searchTerm) {
                    filteredCampus = filteredCampus.filter(campus => campus.campDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                     campus.campAddress.toLowerCase().includes(searchTerm.toLowerCase())     ||
                                                                     campus.campDeparment.toLowerCase().includes(searchTerm.toLowerCase())   ||
                                                                     campus.campCity.toLowerCase().includes(searchTerm.toLowerCase())        ||
                                                                     campus.campType.toLowerCase().includes(searchTerm.toLowerCase())        || 
                                                                     campus.campOrgCode.toLowerCase().includes(searchTerm.toLowerCase()));
                } else if (filterLength > 0) {
                    filteredCampus = filteredCampus.filter(campus => filterOptions.includes(campus.campStatus));
                }
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: campus.message,
                campus: filteredCampus//majors.majors
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: campus.status,
                mensaje: campus.message
            });
        };
    } catch (error) {
        next();
    };    
    
};

const createCampus = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {campCode} = req.body;
        const campusExist = await CampusModel.campusExists( campCode );
        
        if( campusExist.type === 'error' ){
            throw new HttpException(500, campusExist.message );
        };
        
        const result = await CampusModel.createCampus(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Campus ha sido creado!'
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

const updateCampus = async( req, res, next ) =>{

    const homologa = {
        'campOrgCode'       : 'camp_org_code',
        'campDescription'   : 'camp_description', 
        'campType'          : 'camp_type',
        'campAddress'       : 'camp_address',    
        'campDepartment'    : 'camp_department', 
        'campCity'          : 'camp_city', 
        'campErpCode'       : 'camp_erp_code',
        'campStatus'        : 'camp_status'
    };

    checkValidation(req);

    const {camp_org_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await CampusModel.updateCampus(newRestOfUpdates[0], req.query.campCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Campus Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Campus no se pudo actualizar'
        });
    };

};

const deleteCampus = async (req, res, next) => {
    
    const campCode = req.query.campCode;

    const result = await CampusModel.deleteCampus(campCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Campus ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllCampus,
    createCampus,
    updateCampus,
    deleteCampus
};