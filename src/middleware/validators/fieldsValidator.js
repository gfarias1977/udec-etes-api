const { response } = require( 'express' );
const { validationResult } = require( 'express-validator' );
const HttpStatus = require('http-status-codes');

const fieldsValidator = ( req, res = response, next ) => {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => `${param}->${msg}`;

    const errors = validationResult( req ).formatWith(errorFormatter);;
    const errores = [...new Set(errors.array())];

    if( !errors.isEmpty() ){
        return res.status(HttpStatus.BAD_REQUEST).json({
            status: -1,
            mensaje: `error: Parámetros incorrectos: ${errores.join('; ')}`
        });
    }else{
        next();
    };
};

module.exports = {
	fieldsValidator
};