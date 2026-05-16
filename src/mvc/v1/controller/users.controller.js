const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const UsersModel = require('../model/users.model');

const getUsers = async( req, res, next ) => {

    try {
        const { filterOptions, searchTerm } = req.query;
        const companyId = req.company;
        const users = await UsersModel.findAllUsers( companyId );
        
        if(users.type === 'ok'){

            const filterLength = filterOptions?.length || 0;
            let filteredUsers = users.users;

            if (searchTerm || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                filteredUsers = filteredUsers.filter(
                    user => user.userDescription.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(user.std_status) ||
                            user.userName.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(user.std_status) ||
                            user.userRut.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(user.std_status) ||
                            user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) && filterOptions.includes(user.std_status),
                );
                } else if (searchTerm) {
                    filteredUsers = filteredUsers.filter(user => user.userDescription.toLowerCase().includes(searchTerm.toLowerCase())
                                                        || user.userName.toLowerCase().includes(searchTerm.toLowerCase())
                                                        || user.userRut.toLowerCase().includes(searchTerm.toLowerCase())
                                                        || user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
                } else {
                    filteredUsers = filteredUsers.filter(user => filterOptions.includes(user.std_status));
                }
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: users.message,
                users: filteredUsers
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: users.status,
                mensaje: users.message
            });
        };
    } catch (error) {
        console.log(error)
        next();
    };
    
};

const createUser = async (req, res, next) => {
    checkValidation(req);

    try {
        
        await hashPassword(req);

        const { userEmail, userTaxPayer, userName } = req.body;
        const companyId = req.company; 
        const userExisits = await UsersModel.userExists( companyId, userEmail, userTaxPayer, userName );
        
        if( userExisits.type === 'error' ){
            throw new HttpException(500, userExisits.message );
        };
        
        const result = await UsersModel.createUser(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Usuario ha sido creado!'
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

const getUserByID = async( req, res, next ) => {

    const userId = req.params.userId;
    const companyId = req.company;

    const user = await UsersModel.findUserByID( userId, companyId );
    
    if(user){
        res.status(200).send({
            type: 'ok',
            status: 200,
            usuario: user
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Usuario no encontrado'
        });
    };

};

const deleteUser = async (req, res, next) => {
    
    const userId = req.params.userId;
    const companyId = req.company;

    const result = await UsersModel.deleteUser( userId, companyId );

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 200,
        message: 'Usuario ha sido eliminado!'
    });
};

const updateUser = async( req, res, next ) =>{

    const homologa = {
        'userFirstname': 'user_first_name',
        'userMiddlename': 'user_middle_name',
        'userLastname': 'user_last_name',
        'userSurname': 'user_sur_name',
        'userAddress': 'user_address',
        'userEmail': 'user_email',
        'userPersonalEmail': 'user_personal_email',
        'userTelephone': 'user_telephone',
        'userCellphone': 'user_cellphone',
        'userGender': 'user_gender',
        'userTaxPayer': 'user_taxpayer_id',
        'userStatus': 'user_status',
        'userPassword': 'user_password'
    };

    checkValidation(req);

    await hashPassword(req);

    const userId = req.params.userId;

    const companyId = req.company;
    const { confirmUserPassword, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await UsersModel.updateUser(newRestOfUpdates[0], userId, companyId );
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Usuario Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Usuario no se pudo actualizar'
        });
    };

};

const getUserByToken = async( req, res, next ) => {

    const userId = req.userId;
    const company = req.company;

    const user = await UsersModel.findUserByToken( userId, company );
    
    if(user){
        res.status(200).send({
            type: 'ok',
            status: 200,
            usuario: user
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Usuario no encontrado'
        });
    };

};

checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

hashPassword = async (req) => {
    if (req.body.userPassword) {
        req.body.userPassword = await bcrypt.hash(req.body.userPassword, 8);
    };
};

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    getUserByID,
    getUsers,
    getUserByToken
};