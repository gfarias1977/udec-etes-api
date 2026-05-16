const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const userCampusExist = async (usrcUserId, usrcCampCode ) => {

    let respuesta;
    try {
        const sqlUserCampusExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Usuario Sede ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_users_campus t1
                    WHERE t1.usrc_user_id      =   @usrcUserId
                      and t1.usrc_camp_code    =   @usrcCampCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usrcUserId',    sql.Int,usrcUserId )
                            .input('usrcCampCode',  sql.VarChar,usrcCampCode )
                            .query(sqlUserCampusExist);

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
module.exports.userCampusExist = userCampusExist;

const getAllUserCampus = async() => {

    let respuesta;
    try {
        const sqlGetAllUserCampus = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usrc_user_id,t1.usrc_camp_code ASC) AS id 
                ,t1.usrc_user_id
                ,t1.usrc_camp_code
                ,t1.usrc_creation_date
                ,t1.usrc_status
            FROM tbl_users_campus t1
            order by t1.usrc_user_id,t1.usrc_camp_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllUserCampus);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios Sede encontrados' : 'No se encontraron Usuarios-Sede',
            userCampus: result?.recordset
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
module.exports.getAllUserCampus = getAllUserCampus;


const getUserCampusById = async(usrcUserId, usrcCampCode) => {

    try {
        
        const sqlGetUserCampusByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usrc_user_id,t1.usrc_camp_code ASC) AS id 
                ,t1.usrc_user_id
                ,t1.usrc_camp_code
                ,t1.usrc_creation_date
                ,t1.usrc_status
            FROM tbl_users_campus t1
            WHERE t1.usrc_user_id      =   @usrcUserId
            and t1.usrc_camp_code      =   @usrcCampCode
            order by t1.usrc_user_id,t1.usrc_camp_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usrcUserId',    sql.Int,usrcUserId )
                            .input('usrcCampCode',  sql.VarChar,usrcCampCode )
                            .query(sqlGetUserCampusByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserCampusById = getUserCampusById;

const getAllUserCampusByName = async(usrcName) => {

    const qryFindUserCampus = 
    `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usrc_user_id,t1.usrc_camp_code ASC) AS id 
                ,t1.usrc_user_id
                ,t1.usrc_camp_code
                ,t1.usrc_creation_date
                ,t1.usrc_status
            FROM tbl_users_campus t1,
                tbl_user t2,
                tbl_campus t3
            WHERE t1.usrc_user_id       =  t2.user_id  
             and t1.usrc_camp_code      =  t3.camp_code
             and (UPPER(t2.user_first_name)   LIKE UPPER(CONCAT('%',@usrcName,'%')) OR
                  UPPER(t3.camp_description)  LIKE UPPER(CONCAT('%',@usrcName,'%')) ) 
            and t1.usrc_status = 'S' 
            order by t1.usrc_user_id,t1.usrc_camp_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usrcName', sql.VarChar,usrcName )
                            .query(qryFindUserCampus);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios Sede encontradas' : 'No se encontraron Usuarios-Sede',
            userCampus: result?.recordset
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
module.exports.getAllUserCampusByName = getAllUserCampusByName;

const createUserCampus = async ( { 
    usrcUserId,
    usrcCampCode,
    usrcStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateUserCampus = `
            INSERT INTO tbl_users_campus
                    (usrc_user_id
                    ,usrc_camp_code
                    ,usrc_creation_date
                    ,usrc_status)
            VALUES
                    (@usrcUserId
                    ,@usrcCampCode
                    ,DBO.fncGetDate()
                    ,@usrcStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usrcUserId',     sql.Int,     usrcUserId  )             
                            .input('usrcCampCode',   sql.VarChar, usrcCampCode)
                            .input('usrcStatus',     sql.VarChar, usrcStatus  )
                            .query(sqlCreateUserCampus);
        
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
module.exports.createUserCampus = createUserCampus;

const updateUserCampus = async( params,usrcUserId, usrcCampCode) => {
    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateUserCampus= `
        UPDATE tbl_users_campus
           SET ${columnSet}
        WHERE usrc_user_id        =   @usrcUserId
          and usrc_camp_code      =   @usrcCampCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usrcUserId',       sql.Int,     usrcUserId   )             
                            .input('usrcCampCode',     sql.VarChar, usrcCampCode )
                            .query(sqlUpdateUserCampus);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUserCampus = updateUserCampus;

const deleteUserCampus = async (usrcUserId, usrcCampCode) => {
        
    try {
        
        const sqlDeleteUserCampus = `
        DELETE 
          FROM tbl_users_campus
        WHERE usrc_user_id        =   @usrcUserId
          and usrc_camp_code      =   @usrcCampCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usrcUserId',       sql.VarChar, usrcUserId   )             
                            .input('usrcCampCode',     sql.VarChar, usrcCampCode )
                            .query(sqlDeleteUserCampus);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserCampus = deleteUserCampus;
