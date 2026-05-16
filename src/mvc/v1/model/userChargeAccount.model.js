const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const userChargeAccountExist = async (ucacUserId, ucacPurcCode,ucacCaccCode  ) => {

    let respuesta;
    try {
        const sqlUserChargeAccountExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Usuario Centro de costo ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_users_charge_accounts t1
                    WHERE t1.ucac_user_id      =   @ucacUserId
                    and t1.ucac_purc_code      =   @ucacPurcCode
                    and t1.ucac_cacc_code      =   @ucacCaccCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ucacUserId',    sql.Int,ucacUserId )
                            .input('ucacPurcCode',  sql.VarChar,ucacPurcCode )
                            .input('ucacCaccCode',  sql.VarChar,ucacCaccCode )
                            .query(sqlUserChargeAccountExist);

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
module.exports.userChargeAccountExist =userChargeAccountExist;

const getAllUserChargeAccounts = async() => {

    let respuesta;
    try {
        const sqlGetAllUserChargeAccounts = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code ASC) AS id 
                ,t1.ucac_user_id
                ,t1.ucac_purc_code
                ,t1.ucac_cacc_code
                ,t1.ucac_creation_date
                ,t1.ucac_status
            FROM dbo.tbl_users_charge_accounts t1
            order by t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllUserChargeAccounts);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios-Area de Compra-Centro de Costo encontrados' : 'No se encontraron Usuarios-Area de compra-Centro de Costo',
            userChargeAccounts: result?.recordset
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
module.exports.getAllUserChargeAccounts = getAllUserChargeAccounts;


const getUserChargeAccountById = async(ucacUserId, ucacPurcCode,ucacCaccCode) => {

    try {
        
        const sqlGetUserChargeAccountByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code ASC) AS id 
                ,t1.ucac_user_id
                ,t1.ucac_purc_code
                ,t1.ucac_cacc_code
                ,t1.ucac_creation_date
                ,t1.ucac_status
            FROM dbo.tbl_users_charge_accounts t1
            WHERE t1.ucac_user_id        =   @ucacUserId
              and t1.ucac_purc_code      =   @ucacPurcCode
              and t1.ucac_cacc_code      =   @ucacCaccCode            
            order by t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ucacUserId',    sql.Int,ucacUserId )
                            .input('ucacPurcCode',  sql.VarChar,ucacPurcCode )
                            .input('ucacCaccCode',  sql.VarChar,ucacCaccCode )                        
                            .query(sqlGetUserChargeAccountByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserChargeAccountById = getUserChargeAccountById;

const getAllUserChargeAccountByName = async(ucacName) => {

    const qryFindUserChargeAccounts = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code ASC) AS id 
            ,t1.ucac_user_id
            ,t1.ucac_purc_code
            ,t1.ucac_cacc_code
            ,t1.ucac_creation_date
            ,t1.ucac_status
        FROM dbo.tbl_users_charge_accounts t1,
            dbo.tbl_user t2,
            dbo.tbl_charge_account t3,
            dbo.tbl_purchase_areas t4
        WHERE 
            t1.ucac_user_id =  t2.user_id
        and t1.ucac_cacc_code = t3.cacc_code
        and t1.ucac_purc_code = t4.purc_code
        and (UPPER(t2.user_first_name)  LIKE UPPER(CONCAT('%',@ucacName,'%')) OR
        UPPER(t3.cacc_description)  LIKE UPPER(CONCAT('%',@ucacName,'%')) OR
        UPPER(t4.purc_name)  LIKE UPPER(CONCAT('%',@ucacName,'%'))) 
        AND t1.ucac_status = 'S'            
        order by t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ucacName', sql.VarChar,ucacName )
                            .query(qryFindUserChargeAccounts);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios-Area de Compra-Centro de Costo encontradas' : 'No se encontraron Usuarios-Area de Compra-Centro de Costo',
            userChargeAccounts: result?.recordset
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
module.exports.getAllUserChargeAccountByName = getAllUserChargeAccountByName;

const createUserChargeAccount = async ( { 
    ucacUserId,
    ucacPurcCode,
    ucacCaccCode,
    ucacStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateUserChargeAccount = `
            INSERT INTO tbl_users_charge_accounts
                    (ucac_user_id
                    ,ucac_purc_code
                    ,ucac_cacc_code
                    ,ucac_creation_date
                    ,ucac_status)
            VALUES
                    (@ucacUserId
                    ,@ucacPurcCode
                    ,@ucacCaccCode
                    ,DBO.fncGetDate()
                    ,@ucacStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ucacUserId',       sql.VarChar, ucacUserId   )             
                            .input('ucacPurcCode',     sql.VarChar, ucacPurcCode )
                            .input('ucacCaccCode',     sql.VarChar, ucacCaccCode )
                            .input('ucacStatus',       sql.VarChar, ucacStatus   )                                                                                                                                                                                                                                
                            .query(sqlCreateUserChargeAccount);
        
        const affectedRows = result.rowsAffected[0];

        respuesta = {
            type: !affectedRows ? 'error' : 'ok',
            status: 200,
            message: 'Registro creado',
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
module.exports.createUserChargeAccount = createUserChargeAccount;

const updateUserChargeAccount = async( params,ucacUserId, ucacPurcCode,ucacCaccCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateUserChargeAccount= `
        UPDATE tbl_users_charge_accounts
           SET ${columnSet}
        WHERE ucac_user_id         =   @ucacUserId
           and ucac_purc_code      =   @ucacPurcCode
           and ucac_cacc_code      =   @ucacCaccCode   
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ucacUserId',       sql.VarChar, ucacUserId   )             
                            .input('ucacPurcCode',     sql.VarChar, ucacPurcCode )
                            .input('ucacCaccCode',     sql.VarChar, ucacCaccCode ) 
                            .query(sqlUpdateUserChargeAccount);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUserChargeAccount = updateUserChargeAccount;

const deleteUserChargeAccount = async (ucacUserId, ucacPurcCode,ucacCaccCode ) => {
        
    try {
        
        const sqlDeleteUserChargeAccount = `
        DELETE 
          FROM tbl_users_charge_accounts
        WHERE ucac_user_id         =   @ucacUserId
          and ucac_purc_code      =   @ucacPurcCode
          and ucac_cacc_code      =   @ucacCaccCode  
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ucacUserId',       sql.VarChar, ucacUserId   )             
                            .input('ucacPurcCode',     sql.VarChar, ucacPurcCode )
                            .input('ucacCaccCode',     sql.VarChar, ucacCaccCode ) 
                            .query(sqlDeleteUserChargeAccount);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserChargeAccount = deleteUserChargeAccount;
