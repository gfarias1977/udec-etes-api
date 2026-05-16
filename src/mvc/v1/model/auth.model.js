const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');

const findOne = async( codigoUsuario, empresaId ) => {

    const qryFindUser = 
    `
    SELECT *
      FROM tbl_user t1
     WHERE t1.user_company_id   =   @empresaId
       AND t1.user_name         =   @codigoUsuario
       AND t1.user_status       =   'S'
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('empresaId', sql.VarChar, empresaId )
                            .input('codigoUsuario', sql.VarChar, codigoUsuario )
                            .query(qryFindUser);
        
        return result.recordset[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.findOne = findOne;

const findUserByID = async( userID, companyId ) => {

    try {
        
        const sqlGetUserByID = `
            SELECT t1.USER_ID                                                                                 AS  userId,
                    t1.USER_TAXPAYER_ID                                                                       AS  userRut,
                    t1.USER_NAME                                                                              AS  userName,
                    dbo.INITCAP( t1.user_first_name + ' ' + t1.user_middle_name + ' ' + t1.user_last_name )   AS  userDescription,
                    t1.USER_EMAIL                                                                             AS  userEmail,
                    TRIM( t1.USER_STATUS )                                                                    AS  userStatus,
                    t1.USER_CREATION_DATE                                                                     AS  userCreationDate,
                    (SELECT role_id, role_order,role_name AS "role_name"
                        FROM tbl_user_roles t01,
                            tbl_roles t02
                        WHERE t01.usro_user_id = t1.user_id  
                            AND t01.usro_role_id = t02.role_id
                            AND t02.role_status = 'S'
                        FOR JSON PATH) as userRoles
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