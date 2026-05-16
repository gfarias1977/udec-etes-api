const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = async (req, res, next) =>{
    try {
        
        const bearerHeader = req.headers['authorization'];

        if(typeof bearerHeader !== 'undefined'){
            const bearerToken = bearerHeader.split(" ")[1]; 

            const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET || "";
            await jwt.verify(bearerToken, secretKey, (err, result ) => {
                if(err){ 
                    res.status(403).send( 'TOKEN inválido.');
                } else {
                    req.userId = result.user;
                    req.company = result.company;
                    next();
                };
            });
            
        } else {
            res.status(403).send( 'No existe TOKEN.');
        };

    } catch (e) {
        e.status = 401;
        next(e);
    };
};
module.exports.auth = auth;

const auth_paso = async (req, res, next) =>{

    // x-token headers
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    };

    try {
        
        const { user, company } = jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );

        req.userId = user;
        req.company = company;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    };

    next();

};

module.exports.auth_paso = auth_paso;