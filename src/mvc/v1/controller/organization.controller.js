const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const OrganizationModel = require('../model/organization.model');

const getAllOrganizations = async( req, res, next ) => {

    try {
        let { filterOptions, searchTerm } = req.query;
        const organizations = await OrganizationModel.getAllOrganizations();
        
        if(filterOptions === undefined) filterOptions = [];
        if(searchTerm === undefined) searchTerm = '';

        if(organizations.type === 'ok'){

            const filterLength = filterOptions?.length || 0;
            let filteredOrganizations = organizations.organizations;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredOrganizations = filteredOrganizations.filter(
                    organization => organization.orgDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(organization.orgStatus));
                } else if (searchTerm) {
                    filteredOrganizations = filteredOrganizations.filter(organization => organization.orgDescription.toLowerCase().includes(searchTerm.toLowerCase()));
                } else {
                    filteredOrganizations = filteredOrganizations.filter(organization => filterOptions.includes(organization.orgStatus));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: organizations.message,
                organizations: filteredOrganizations //organizations.organizations
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: organizations.status,
                mensaje: organizations.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getOrganizationById = async( req, res, next ) => {

    const orgCode = req.query.orgCode;

    const organization = await OrganizationModel.getOrganizationById( orgCode );
    
    if(organization){
        res.status(200).send({
            type: 'ok',
            status: 200,
            organization: organization
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Organizacion no encontrada'
        });
    };

};

const getAllOrganizationsByName = async( req, res, next ) => {

    const orgDescription = req.query.orgDescription;
    try {

        const organizations = await OrganizationModel.getAllOrganizationsByName( orgDescription );

        if(organizations.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: organizations.message,
                organizations: organizations.organizations
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: organizations.status,
                mensaje: organizations.message
            });
        };
    } catch (error) {
        next();
    };
};

const getAllOrganizationsByUserId = async( req, res, next ) => {
    
    const orgUserId = req.userId;

    try {
        const organizations = await OrganizationModel.getAllOrganizationsByUserId(orgUserId);

        if(organizations.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: organizations.message,
                organizations: organizations.organizations
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: organizations.status,
                mensaje: organizations.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const createOrganization = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {orgCode} = req.body;
        const organizationExist = await OrganizationModel.organizationExists( orgCode );
        
        if( organizationExist.type === 'error' ){
            throw new HttpException(500, organizationExist.message );
        };
        
        const result = await OrganizationModel.createOrganization(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Organizacion ha sido creada!'
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

const updateOrganization = async( req, res, next ) =>{

    const homologa = {
        'orgDescription'  :  'org_description',
        'orgTaxPayerId'   :  'org_tax_payer_id',
        'orgAddress'      :  'org_address',
        'orgDepartment'   :  'org_department',
        'orgCity'         :  'org_city',
        'orgErpCode'      :  'org_erp_code',
        'orgUo'           :  'org_uo',
        'orgLegalEntityId':  'org_legal_entity_id',
        'orgLedgerId'     :  'org_ledger_id',
        'orgStatus'       :  'org_status'
    };

    checkValidation(req);

    const {org_description, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await OrganizationModel.updateOrganization(newRestOfUpdates[0], req.query.orgCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Organizacion Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Organizacion no se pudo actualizar'
        });
    };

};

const deleteOrganization = async (req, res, next) => {
    
    const orgCode = req.query.orgCode;

    const result = await OrganizationModel.deleteOrganization(orgCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Organizacion ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllOrganizations,
    getOrganizationById,
    getAllOrganizationsByName,
    getAllOrganizationsByUserId,
    createOrganization,
    updateOrganization,
    deleteOrganization
};