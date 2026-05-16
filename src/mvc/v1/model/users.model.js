const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const userExists = async ( companyId, email, rut, userName ) => {

    let respuesta;
    try {
        const sqlEmailExists = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Email ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_user t1
                   WHERE t1.user_company_id =   @companyId
                     AND t1.user_email      =   @email
                  UNION
                  SELECT 'RUT ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_user t1
                   WHERE t1.user_company_id     =   @companyId
                     AND t1.user_taxpayer_id    =   @rut
                   UNION
                  SELECT 'Nombre de usuario ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_user t1
                   WHERE t1.user_company_id    =   @companyId
                     AND t1.user_name          =   @userName
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('companyId', sql.Int, companyId )
                            .input('email',     sql.VarChar, email )
                            .input('rut',       sql.VarChar, rut )
                            .input('userName',  sql.VarChar, userName )
                            .query(sqlEmailExists);

        respuesta = {
            type: result?.recordset[0].validacion ? 'error' : 'ok',
            status: 200,
            message: result?.recordset[0].validacion,
        };

    } catch (error) {
        respuesta = {
            type: 'error',
            status: 400,
            message: error.message,
        };
    };

    return respuesta;
};
module.exports.userExists = userExists;

const findAllUsers = async( companyId ) => {

    let respuesta;
    try {
        const sqlGetAllUsers = `
               SELECT t1.USER_ID                                                                                AS  userId,
                      t1.USER_TAXPAYER_ID                                                                       AS  userRut,
                      t1.USER_NAME                                                                              AS  userName,
                      dbo.INITCAP( t1.user_first_name + ' ' + t1.user_middle_name + ' ' + t1.user_last_name )   AS  userDescription,
                      t1.USER_EMAIL                                                                             AS  userEmail,
                      TRIM( t1.USER_STATUS )                                                                    AS  userStatus,
                      t1.user_first_name                                                                        AS  userFirstName,
                      t1.user_middle_name                                                                       AS  userMiddleName,
                      t1.user_last_name                                                                         AS  userLastName,
                      t1.user_cellphone                                                                         AS  userCellphone,
                      t1.user_gender                                                                            AS  userGender,
                      t1.user_address                                                                           AS  userAddress,
                      t1.user_password                                                                          AS  userPassword 
                 FROM tbl_user t1
                WHERE t1.user_company_id        =   @companyId
             ORDER BY t1.user_id
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('companyId', sql.Int, companyId )
                            .query(sqlGetAllUsers);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios encontrados' : 'No se encontraron usuarios',
            users: result?.recordset
        };

    } catch (error) {
        respuesta = {
            type: 'error',
            status: 400,
            message: error.message,
        };
    };

    return respuesta;
};
module.exports.findAllUsers = findAllUsers;

const createUser = async ( { 
    userCompay, 
    userFirstname, 
    userMiddlename, 
    userLastname, 
    userSurname, 
    userAddress, 
    userEmail, 
    userPersonalEmail, 
    userTelephone, 
    userCellphone, 
    userName, 
    userGender, 
    userPassword, 
    userTaxPayer, 
    userStatus,
} ) => {
        
    let respuesta;
    try {
        
        const sqlCreateUser = `
        INSERT INTO tbl_user(
            [user_company_id],
            [user_first_name],
            [user_middle_name],
            [user_last_name],
            [user_sur_name],
            [user_address],
            [user_email],
            [user_personal_email],
            [user_telephone],
            [user_cellphone],
            [user_creation_date],
            [user_name],
            [user_gender],
            [user_password],
            [user_taxpayer_id],
            [user_status]
        )VALUES(
            @userCompay,
            @userFirstname,
            @userMiddlename,
            @userLastname,
            @userSurname,
            @userAddress,
            @userEmail,
            @userPersonalEmail,
            @userTelephone,
            @userCellphone,
            DBO.fncGetDate(),
            @userName,
            @userGender,
            @userPassword,
            @userTaxPayer,
            @userStatus
        );
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('userCompay',        sql.Int,      userCompay )
                            .input('userFirstname',     sql.VarChar,  userFirstname )
                            .input('userMiddlename',    sql.VarChar,  userMiddlename )
                            .input('userLastname',      sql.VarChar,  userLastname )
                            .input('userSurname',       sql.VarChar,  userSurname )
                            .input('userAddress',       sql.VarChar,  userAddress )
                            .input('userEmail',         sql.VarChar,  userEmail )
                            .input('userPersonalEmail', sql.VarChar,  userPersonalEmail )
                            .input('userTelephone',     sql.VarChar,  userTelephone )
                            .input('userCellphone',     sql.VarChar,  userCellphone )
                            .input('userName',          sql.VarChar,  userName )
                            .input('userGender',        sql.NChar(1), userGender )
                            .input('userPassword',      sql.VarChar,  userPassword )
                            .input('userTaxPayer',      sql.VarChar,  userTaxPayer )
                            .input('userStatus',        sql.VarChar,  userStatus )
                            .query(sqlCreateUser);

        const affectedRows = result.rowsAffected[0];

        respuesta = {
            type: !affectedRows ? 'error' : 'ok',
            status: 200,
            message: 'Registro creado',
        };

    } catch (error) {
        console.log(error);
        respuesta = {
            type: 'error',
            status: 400,
            message: error.message,
        };
    };

    return respuesta;
};
module.exports.createUser = createUser;

const findUserByID = async( userID, companyId ) => {

    try {
        
        const sqlGetUserByID = `
           SELECT t1.USER_ID                                                                                AS  userId,
                  t1.USER_TAXPAYER_ID                                                                       AS  userRut,
                  t1.USER_NAME                                                                              AS  userName,
                  dbo.INITCAP( t1.user_first_name + ' ' + t1.user_middle_name + ' ' + t1.user_last_name )   AS  userDescription,
                  t1.USER_EMAIL                                                                             AS  userEmail,
                  TRIM( t1.USER_STATUS )                                                                    AS  userStatus
             FROM tbl_user t1
            WHERE t1.user_id                =   @userID
              AND t1.user_company_id        =   @companyId
         ORDER BY t1.user_id
    `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('userID',    sql.VarChar, userID )
                            .input('companyId', sql.VarChar, companyId )
                            .query(sqlGetUserByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.findUserByID = findUserByID;

const deleteUser = async ( userId, companyId ) => {
        
    try {
        
        const sqlDeleteUser = `
        DELETE 
          FROM tbl_user
         WHERE user_id          =   @userId
           AND user_company_id  =   @companyId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('userId',    sql.VarChar, userId )
                            .input('companyId', sql.VarChar, companyId )
                            .query(sqlDeleteUser);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};
module.exports.deleteUser = deleteUser;

const updateUser = async( params, userId, companyId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateUser = `
        UPDATE tbl_user
           SET ${columnSet}
         WHERE user_id          =   @userId
           AND user_company_id  =   @companyId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('userId',    sql.VarChar, userId )
                            .input('companyId', sql.VarChar, companyId )
                            .query(sqlUpdateUser);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUser = updateUser;

const findUserByToken = async( userId, company ) => {

    try {
        
        const sqlGetUserByToken = `
        SELECT dbo.INITCAP( user_first_name + ' ' + user_middle_name + ' ' + user_last_name )   AS  userDescription,
               user_email,
               user_creation_date,
               user_name,
               TRIM( user_status )                                                              AS  userStatus
          FROM dbo.tbl_user t1
         WHERE t1.user_company_id   =   @company
           AND t1.user_id           =   @userId
           AND t1.user_status       =   'S'
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('company', sql.VarChar, company )
                            .input('userId',  sql.VarChar, userId )
                            .query(sqlGetUserByToken);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.findUserByToken = findUserByToken;