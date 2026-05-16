const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const RoleModel = require('../model/role.model');

const getAllRoles = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm } = req.query;
        const roles = await RoleModel.getAllRoles();

        if(roles.type === 'ok'){
            const filterLength = filterOptions?.length || 0;
            let filteredRoles = roles.roles;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredRoles = filteredRoles.filter(
                    rol => rol.roleDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(rol.rolStatus) ||
                           rol.rolName.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(rol.rolStatus),
                );
                } else if (searchTerm) {
                    filteredRoles = filteredRoles.filter(rol => rol.rolDescription.toLowerCase().includes(searchTerm.toLowerCase())
                                                             || rol.rolName.toLowerCase().includes(searchTerm.toLowerCase()),
                                                        );
                } else {
                    filteredRoles = filteredRoles.filter(user => filterOptions.includes(user.std_status));
                }
            };            
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roles.message,
                roles: filteredRoles//roles.roles
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roles.status,
                mensaje: roles.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getRoleById = async( req, res, next ) => {

    const roleId = req.query.roleId;

    const role = await RoleModel.getRoleById( roleId );
    
    if(role){
        res.status(200).send({
            type: 'ok',
            status: 200,
            rol: role
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Rol no encontrado'
        });
    };

};


const getAllRolesByName = async( req, res, next ) => {

    const roleName = req.query.roleName;
    try {

        const roles = await RoleModel.getAllRolesByName( roleName );

        if(roles.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: roles.message,
                roles: roles.roles
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: roles.status,
                mensaje: roles.message
            });
        };
    } catch (error) {
        next();
    };
};

const createRole = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {roleName} = req.body;
        const roleExist = await RoleModel.roleExists( roleName );
        
        if( roleExist.type === 'error' ){
            throw new HttpException(500, roleExist.message );
        };
        
        const result = await RoleModel.createRole(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Rol ha sido creado!'
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

const updateRole = async( req, res, next ) =>{

    const homologa = {
        'roleName': 'role_name',
        'roleDescription': 'role_description',
        'roleStatus': 'role_status'
    };

    checkValidation(req);

    const {role_name, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await RoleModel.updateRole(newRestOfUpdates[0], req.query.roleId);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Rol Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Rol no se pudo actualizar'
        });
    };

};

const deleteRole = async (req, res, next) => {
    
    const roleId = req.query.roleId;

    const result = await RoleModel.deleteRole(roleId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Rol ha sido eliminado!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    getAllRolesByName,
    createRole,
    updateRole,
    deleteRole
};