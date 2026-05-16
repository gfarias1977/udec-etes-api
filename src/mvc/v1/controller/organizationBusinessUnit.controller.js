const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const OrganizationBusinessUnitModel = require('../model/organizationBusinessUnit.model');

const getAllOrganizationBusinessUnits = async( req, res, next ) => {

    try {
        const organizationBusinessUnits = await OrganizationBusinessUnitModel.getAllOrganizationBusinessUnits();

        if(organizationBusinessUnits.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: organizationBusinessUnits.message,
                organizationBusinessUnits: organizationBusinessUnits.organizationBusinessUnits
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: organizationBusinessUnits.status,
                mensaje: organizationBusinessUnits.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getOrganizationBusinessUnitById = async( req, res, next ) => {

    const ogbuOrgCode = req.query.ogbuOrgCode;
    const ogbuBuCode = req.query.ogbuBuCode;

    const organizationBusinessUnit = await OrganizationBusinessUnitModel.getOrganizationBusinessUnitById( ogbuOrgCode, ogbuBuCode );
    
    if(organizationBusinessUnit){
        res.status(200).send({
            type: 'ok',
            status: 200,
            organizationBusinessUnit: organizationBusinessUnit
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Usuarios-Area de Compra-Centro de Costo no encontrado'
        });
    };

};


const getAllOrganizationBusinessUnitsByName = async( req, res, next ) => {

    const ogbuName = req.query.ogbuName;
    try {

        const organizationBusinessUnits = await OrganizationBusinessUnitModel.getAllOrganizationBusinessUnitByName( ogbuName );

        if(organizationBusinessUnits.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: organizationBusinessUnits.message,
                organizationBusinessUnits: organizationBusinessUnits.organizationBusinessUnits
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: organizationBusinessUnits.status,
                mensaje: organizationBusinessUnits.message
            });
        };
    } catch (error) {
        next();
    };
};

const createOrganizationBusinessUnit = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {ogbuOrgCode, ogbuBuCode} = req.body;
        const organizationBusinessUnitExist = await OrganizationBusinessUnitModel.organizationBusinessUnitExist( ogbuOrgCode, ogbuBuCode );
        
        if( organizationBusinessUnitExist.type === 'error' ){
            throw new HttpException(500, organizationBusinessUnitExist.message );
        };
        
        const result = await OrganizationBusinessUnitModel.createOrganizationBusinessUnit(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Organizacion Unidades de Negocio ha sido creado!'
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

const updateOrganizationBusinessUnit = async( req, res, next ) =>{

    const homologa = {
        'ogbuStatus' :'ogbu_status',
    };

    checkValidation(req);

    const {ogbu_status, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await OrganizationBusinessUnitModel.updateOrganizationBusinessUnit(newRestOfUpdates[0], req.query.ogbuOrgCode, req.query.ogbuBuCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Organizacion Unidades de Negocio Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Organizacion Unidades de Negocio no se pudo actualizar'
        });
    };

};

const deleteOrganizationBusinessUnit = async (req, res, next) => {
    
    const ogbuOrgCode=req.query.ogbuOrgCode;
    const ogbuBuCode=req.query.ogbuBuCode;
    
    const result = await OrganizationBusinessUnitModel.deleteOrganizationBusinessUnit(ogbuOrgCode,ogbuBuCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Organizacion Unidades de Negocio ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllOrganizationBusinessUnits,
    getOrganizationBusinessUnitById,
    getAllOrganizationBusinessUnitsByName,
    createOrganizationBusinessUnit,
    updateOrganizationBusinessUnit,
    deleteOrganizationBusinessUnit
};