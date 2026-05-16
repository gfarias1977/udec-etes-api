const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const formatType = require('../model/formatType.model');

const getAllFormatTypes = async( req, res, next ) => {

    try {
        const formatTypes = await formatType.getAllFormatTypes();

        if(formatTypes.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: formatTypes.message,
                formatTypes: formatTypes.formatTypes
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: formatTypes.status,
                mensaje: formatTypes.message
            });
        };
    } catch (error) {
        next();
    };
    
};


const createFormatType = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {fmtFormatType} = req.body;
        const formatTypeExist = await formatType.formatTypeExists( fmtFormatType );
        
        if( formatTypeExist.type === 'error' ){
            throw new HttpException(500, formatTypeExist.message );
        };
        
        const result = await formatType.createFormatType(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Formato Bibliográfico ha sido creada!'
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

const updateFormatType = async( req, res, next ) =>{

    const homologa = {

        'fmtFormat'       :'fmt_format',
        'fmtFormatType'   :'fmt_format_type',
        'fmtDescription'  :'fmt_description',
        'fmtStatus'       :'fmt_status',  
    };

    checkValidation(req);

    const {fmt_format, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await formatType.updateFormatType(newRestOfUpdates[0], req.query.fmtId);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Formato Bibliográfico Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Formato Bibliográfico no se pudo actualizar'
        });
    };

};

const deleteFormatType = async (req, res, next) => {
    
    const fmtId = req.query.fmtId;

    const result = await formatType.deleteFormatType(fmtId);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Formato Bibliográfico ha sido eliminada!'
    });
};



checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllFormatTypes,
    createFormatType,
    updateFormatType,
    deleteFormatType
};