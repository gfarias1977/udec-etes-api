const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const AuthModel = require('../model/auth.model');
const UserPurchaseAreaModel = require('../model/userPurchaseArea.model');
const UserBusinessUnitModel = require('../model/userBusinessUnit.model');

const userLogin = async (req, res, next) => {

    checkValidation(req);

    let { username, password, userCompany, businessUnit, purchaseArea } = req.body;
    
    const user = await AuthModel.findOne( username, userCompany );
    const userPurchaseArea = await UserPurchaseAreaModel.getUserPurchaseAreaByUserName( username, purchaseArea );
    const userBusinessUnit = await UserBusinessUnitModel.getUserBusinessUnitByUserName( username, businessUnit );

    
    if (!user) {
        throw new HttpException(401, 'No se puede iniciar sesión!');
    };
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
        throw new HttpException(401, 'Password incorrecta!');
    };
    if (!userPurchaseArea) {
        throw new HttpException(401, 'Usuario: ' + username + ' No tiene permisos para acceder a la Area de Académica: ' + purchaseArea);
    };
    if (!userBusinessUnit) {
        throw new HttpException(401, 'Usuario: ' + username + ' No tiene permisos para acceder a la Unidad de Gestión: ' + businessUnit);
    };
    
    // user matched!
    const secretKeyAccessToken = process.env.JWT_ACCESS_TOKEN_SECRET || '';
    const expiresAccessToken = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '10m';
    const secretKeyRefreshToken = process.env.JWT_REFRESH_TOKEN_SECRET || '';
    const expiresRefreshToken = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '20m';
    
    const access_token = jwt.sign({ 
            user: user.user_id.toString(), 
            company: user.user_company_id.toString(),
            userPurchaseArea:userPurchaseArea.uspaPurcCode.toString(),
            userBusinessUnit:userBusinessUnit.usbuBuCode.toString() 
        }, secretKeyAccessToken, {
        expiresIn: expiresAccessToken
    });

    const refresh_token = jwt.sign({ 
            user: user.user_id.toString(), 
            company: user.user_company_id.toString(),
            userPurchaseArea:userPurchaseArea.uspaPurcCode.toString(),
            userBusinessUnit:userBusinessUnit.usbuBuCode.toString()             
        }, secretKeyRefreshToken, {
        expiresIn: expiresRefreshToken
    });

    const { user_password, ...userWithoutPassword } = user;
    
    if(userWithoutPassword){
        
        res.status(200).send( {
            result: true,
            token:{
                access_token: access_token,
            },
            message: 'Login exitoso!',
            // codigo: 0,
            // login: {
            //     accessToken: access_token,
            //     refreshToken: refresh_token,
            //     userName: ( user.user_first_name + ' ' + user.user_middle_name + ' ' + user.user_last_name ),
            //     userEmail: user.user_email,
            // },
            // mensaje: 'Usuario autenticado correctamente!'
        });
    }else{
        res.status( 200 ).send( { userWithoutPassword } )
    };
};

const userMe = async( req, res, next ) => {
    
    try {
      
        const userID = req.userId;
        const companyId = req.company;
        
        const user = await AuthModel.findUserByID( userID, companyId );

        if (!user) {
            throw new HttpException(401, 'No se puede iniciar sesión!');
        };

        res.status(200).send( {
            result: true,
            user: {
                id: user.userId,
                userName: user.userName,
                name: user.userDescription,
                email: user.userEmail,
                created_at: user.userCreationDate,
                roles: user.userRoles,
            }
        });
    } catch (error) {
        next(error);
    };
};

const userLogout = async (req, res, next) => {

    try {
        res.status(200).send( {
            result: true,
            message: 'Logout exitoso!'
        });
    } catch (error) {
        next(error);
    };
};

checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

hashPassword = async (req) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
    };
};

module.exports = {
    userLogin,
    userMe,
    userLogout,
};