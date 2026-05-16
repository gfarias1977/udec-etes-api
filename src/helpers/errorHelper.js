const HttpStatus = require('http-status-codes');
const ambiente = process.env.NODE_ENV || 'development';

module.exports = {
    notFound: (res, info) => {
        const err = ( ambiente !== 'production' ) 
                        ? info.mensaje
                        : 'Se ha producido un error al recuperar la información.';

        res.status(HttpStatus.NOT_FOUND).json({
            ok: false,
            mensaje: err
        });

    },

    incompleteRequest: (res, info) => {

        res.status(HttpStatus.BAD_REQUEST).json({
            ok: info.ok,
            mensaje: 'Por favor, ingrese todos los datos.'
        });
    },

    internalError: (res, info) => {
        const mensaje = info.mensaje.replace(/\\/, "\\\\");

        const err = ( ambiente !== 'production' ) 
                        ? mensaje
                        : 'Se produjo un error en proceso.';

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            ok: info.ok,
            mensaje: err
        });
    },

    responseTexto:(res ,info) => {
    
        res.status(HttpStatus.OK).json({
           ok: info.ok,
           mensaje: info.mensaje
       });
   },

    responseDatos:(res ,info) => {
    
         res.status(HttpStatus.OK).json({
            ok: info.ok,
            registros: info.registros
        });
    }
};