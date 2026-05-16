const dotenv = require('dotenv');

const {defaultEnv} = require('./config/config');
const webApp = require('./services/webapp.js');
dotenv.config();

async function startup() {

    console.log(`Iniciando Aplicación en ambiente: **${(process.env.NODE_ENV=== undefined) ? defaultEnv : process.env.NODE_ENV}**`);
    if(process.env.NODE_ENV === undefined){
        console.log(`Ambiente por defecto: **${defaultEnv}**`)
    };
       
    try { 
        console.log(`Inicializando módulo web en: **${process.env.PORT}**`);
        await webApp.initialize(process.env.PORT);
    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    };
    try {
        console.log(`Inicializando módulo Base de Datos en: ${process.env.DB_SERVER}`);

    } catch (err) {
        
        console.error(err);
        process.exit(1); // Non-zero failure code
    };
 
}

startup();

async function shutdown(e) {
    let err = e;

    console.log('Cerrando aplicación');

    try {
        console.log('Cerrando módulo servidor web');

        await webApp.close();
    } catch (e) {
        console.error(e);

        err = err || e;
    };

    console.log('Saliendo del proceso');

    if (err) {
        process.exit(1); // Non-zero failure code
    } else {
        process.exit(0);
    };
}

process.on('SIGTERM', () => {
    console.log('Recibido SIGTERM');

    shutdown();
});

process.on('SIGINT', () => {
    console.log('Recibido SIGINT');

    shutdown();
});

process.on('uncaughtException', err => {
    console.log('Uncaught exception');
    console.error(err);

    shutdown(err);
});
