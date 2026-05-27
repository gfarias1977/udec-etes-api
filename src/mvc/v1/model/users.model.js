
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const userExists = async ( companyId, email, rut, userName ) => {

    let respuesta;
    try {
        const sqlEmailExists = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Email ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_user t1
                   WHERE t1.user_company_id =   $1
                     AND t1.user_email      =   $2
                  UNION
                  SELECT 'RUT ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_user t1
                   WHERE t1.user_company_id     =   $1
                     AND t1.user_taxpayer_id    =   $3
                   UNION
                  SELECT 'Nombre de usuario ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_user t1
                   WHERE t1.user_company_id    =   $1
                     AND t1.user_name          =   $4
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlEmailExists, [companyId, email, rut, userName]);

        respuesta = {
            type: result?.rows[0].validacion ? 'error' : 'ok',
            status: 200,
            message: result?.rows[0].validacion,
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
               SELECT t1.USER_ID                                                                                AS "userId",
                      t1.USER_TAXPAYER_ID                                                                       AS "userRut",
                      t1.USER_NAME                                                                              AS "userName",
                      INITCAP( t1.user_first_name || ' ' || t1.user_middle_name || ' ' || t1.user_last_name )   AS "userDescription",
                      t1.USER_EMAIL                                                                             AS "userEmail",
                      TRIM( t1.USER_STATUS )                                                                    AS "userStatus",
                      t1.user_first_name                                                                        AS "userFirstName",
                      t1.user_middle_name                                                                       AS "userMiddleName",
                      t1.user_last_name                                                                         AS "userLastName",
                      t1.user_cellphone                                                                         AS "userCellphone",
                      t1.user_gender                                                                            AS "userGender",
                      t1.user_address                                                                           AS "userAddress",
                      t1.user_password                                                                          AS "userPassword" 
                 FROM tbl_user t1
                WHERE t1.user_company_id        =   $1
             ORDER BY t1.user_id
        `;

        const result = await pool.query(sqlGetAllUsers, [companyId]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios encontrados' : 'No se encontraron usuarios',
            users: result?.rows
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
            user_company_id,
            user_first_name,
            user_middle_name,
            user_last_name,
            user_sur_name,
            user_address,
            user_email,
            user_personal_email,
            user_telephone,
            user_cellphone,
            user_creation_date,
            user_name,
            user_gender,
            user_password,
            user_taxpayer_id,
            user_status
        )VALUES(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            NOW(),
            $11,
            $12,
            $13,
            $14,
            $15
        );
        `;

        const result = await pool.query(sqlCreateUser, [userCompay, userFirstname, userMiddlename, userLastname, userSurname, userAddress, userEmail, userPersonalEmail, userTelephone, userCellphone, userName, userGender, userPassword, userTaxPayer, userStatus]);

        const affectedRows = result.rowCount;

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
           SELECT t1.USER_ID                                                                                AS "userId",
                  t1.USER_TAXPAYER_ID                                                                       AS "userRut",
                  t1.USER_NAME                                                                              AS "userName",
                  INITCAP( t1.user_first_name || ' ' || t1.user_middle_name || ' ' || t1.user_last_name )   AS "userDescription",
                  t1.USER_EMAIL                                                                             AS "userEmail",
                  TRIM( t1.USER_STATUS )                                                                    AS "userStatus"
             FROM tbl_user t1
            WHERE t1.user_id                =   $1
              AND t1.user_company_id        =   $2
         ORDER BY t1.user_id
    `;

        const result = await pool.query(sqlGetUserByID, [userID, companyId]);
        
        return result?.rows[0];
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
         WHERE user_id          =   $1
           AND user_company_id  =   $2
        `;

        const result = await pool.query(sqlDeleteUser, [userId, companyId]);
        
        const affectedRows = result.rowCount;

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
         WHERE user_id          =   $1
           AND user_company_id  =   $2
        `;

        const result = await pool.query(sqlUpdateUser, [userId, companyId]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUser = updateUser;

const findUserByToken = async( userId, company ) => {

    try {
        
        const sqlGetUserByToken = `
        SELECT INITCAP( user_first_name || ' ' || user_middle_name || ' ' || user_last_name )   AS "userDescription",
               user_email,
               user_creation_date,
               user_name,
               TRIM( user_status )                                                              AS "userStatus"
          FROM tbl_user t1
         WHERE t1.user_company_id   =   $1
           AND t1.user_id           =   $2
           AND t1.user_status       =   'S'
        `;

        const result = await pool.query(sqlGetUserByToken, [company, userId]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.findUserByToken = findUserByToken;