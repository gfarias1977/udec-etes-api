const nodemailer = require('nodemailer');

exports.enviarMail = ( { desde, para, copia = null, copiaOculta = null, asunto, texto, html } )  =>{
    
    let envioOK = Boolean;
    let status = Number(200);
    
    var transporter = nodemailer.createTransport({
        host: "ska105156.dedicados.cl",
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
            // type: 'login',
            user: "administrador@transgamboa.cl",
            pass: "wb3nqI&!abrk"
        }
    });
    
    var message = {
        from: desde,
        to: para,
        cc: copia,
        bcc: copiaOculta,
        subject: asunto, 
        text: texto,
        html: html
    };
    
    transporter.sendMail(message, function(error, response) {
        if (error) {
            console.log(error);
            status = Number( 500 );
            envioOK = Boolean(false);
        } else {            
            status = Number( 200 );
            envioOK = Boolean(true);
        }
    });

    return ({
        envioOK: Boolean( envioOK ),
        status
    });
};