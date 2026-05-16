const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const UserBusinessUnitExist = async (usbuUserId, usbuBuCode ) => {

    let respuesta;
    try {
        const sqlUserBusinessUnitExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Usuario Unidad de Negocio ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_users_business_units t1
                    WHERE t1.usbu_user_id    =   @usbuUserId
                      and t1.usbu_bu_code    =   @usbuBuCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usbuUserId',  sql.Int,usbuUserId )
                            .input('usbuBuCode',  sql.VarChar,usbuBuCode )
                            .query(sqlUserBusinessUnitExist);

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
module.exports.UserBusinessUnitExist = UserBusinessUnitExist;

const getAllUserBusinessUnits = async() => {

    let respuesta;
    try {
        const sqlGetAllUserBusinessUnit = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usbu_user_id,t1.usbu_bu_code ASC) AS id 
                ,t1.usbu_user_id            AS usbuUserId
                ,t1.usbu_bu_code            AS usbuBuCode
                ,t2.bu_name                 AS usbuBuName                
                ,t1.usbu_creation_date      AS usbuBuCreationDate
                ,t1.usbu_status             AS usbuBuStatus
            FROM tbl_users_business_units t1,
                 tbl_business_units t2
            WHERE t1.usbu_bu_code = t2.bu_code 
            order by t2.bu_name
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllUserBusinessUnit);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios Unidad de Negocio encontrados' : 'No se encontraron Usuarios-Unidad de Negocio',
            userBusinessUnits: result?.recordset
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
module.exports.getAllUserBusinessUnits = getAllUserBusinessUnits


const getUserBusinessUnitById = async(usbuUserId, usbuBuCode) => {

    try {
        
        const sqlGetUserBusinessUnitByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usbu_user_id,t1.usbu_bu_code ASC) AS id 
                ,t1.usbu_user_id            AS usbuUserId
                ,t1.usbu_bu_code            AS usbuBuCode
                ,t2.bu_name                 AS usbuBuName                
                ,t1.usbu_creation_date      AS usbuBuCreationDate
                ,t1.usbu_status             AS usbuBuStatus
            FROM tbl_users_business_units t1,
                 tbl_business_units t2
            WHERE t1.usbu_bu_code    = t2.bu_code 
                and t1.usbu_user_id  =   @usbuUserId
                and t1.usbu_bu_code  =   @usbuBuCode
            order by t2.bu_name
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usbuUserId',  sql.Int,usbuUserId )
                            .input('usbuBuCode',  sql.VarChar,usbuBuCode )
                            .query(sqlGetUserBusinessUnitByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserBusinessUnitById = getUserBusinessUnitById;

const getAllBusinessUnitsByUserId = async(usbuUserId) => {

    try {
        
        const sqlGetUserBusinessUnitsByUserID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t2.usbu_user_id,t2.usbu_bu_code ASC) AS id 
                ,coalesce(t2.usbu_user_id,@usbuUserId)   AS usbuUserId  
                ,t1.bu_code                              AS usbuBuCode
                ,t1.bu_name                              AS usbuBuName                
                ,t2.usbu_creation_date                   AS usbuBuCreationDate
                ,coalesce(t2.usbu_status, 'N')           AS usbuBuAsigned
                ,coalesce(t2.usbu_status, t1.bu_status)  AS usbuBuStatus
            FROM  tbl_business_units t1
                left join  tbl_users_business_units t2 on t2.usbu_bu_code = t1.bu_code  
            and t2.usbu_user_id    =  @usbuUserId
            order by t1.bu_name, coalesce(t2.usbu_status, 'N')
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usbuUserId',    sql.Int,    usbuUserId   )
                            .query(sqlGetUserBusinessUnitsByUserID);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuario Unidades de Negocio encontrados' : 'No se encontraron Usuario Unidades de Negocio',
            userBusinessUnits: result?.recordset
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

module.exports.getAllBusinessUnitsByUserId = getAllBusinessUnitsByUserId;

const getUserBusinessUnitByUserName = async(usbuUserName, usbuBuCode) => {

    try {
        
        const sqlGetUserBusinessUnitByUserName = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usbu_user_id,t1.usbu_bu_code ASC) AS id 
                ,t1.usbu_user_id            AS usbuUserId
                ,t1.usbu_bu_code            AS usbuBuCode
                ,t3.bu_name                 AS usbuBuName 
                ,t1.usbu_creation_date      AS usbuBuCreationDate
                ,t1.usbu_status             AS usbuBuStatus
            FROM tbl_users_business_units t1,
                 tbl_user t2,
                 tbl_business_units t3
            WHERE t1.usbu_bu_code   =   t3.bu_code 
              and t1.usbu_user_id   =   t2.user_id
              and t2.user_name      =   @usbuUserName
              and t1.usbu_bu_code   =   @usbuBuCode
            order by t3.bu_name
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usbuUserName',  sql.VarChar, usbuUserName   )
                            .input('usbuBuCode',    sql.VarChar, usbuBuCode )
                            .query(sqlGetUserBusinessUnitByUserName);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserBusinessUnitByUserName = getUserBusinessUnitByUserName;

const getAllUserBusinessUnitByName = async(usbuName) => {

    const qryFindUserBusinessUnit = 
    `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usbu_user_id,t1.usbu_bu_code ASC) AS id 
                ,t1.usbu_user_id            AS usbuUserId
                ,t1.usbu_bu_code            AS usbuBuCode
                ,t3.bu_name                 AS usbuBuName                
                ,t1.usbu_creation_date      AS usbuBuCreationDate
                ,t1.usbu_status             AS usbuBuStatus
            FROM tbl_users_business_units t1,
                tbl_user t2,
                tbl_business_units t3
            WHERE t1.usbu_user_id      =  t2.user_id  
              and t1.usbu_bu_code      =  t3.bu_code
              and (UPPER(t2.user_first_name)   LIKE UPPER(CONCAT('%',@usbuName,'%')) OR
                   UPPER(t3.bu_name)           LIKE UPPER(CONCAT('%',@usbuName,'%')) ) 
            and t1.usbu_status = 'S' 
            order by t3.bu_name
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usbuName', sql.VarChar,usbuName )
                            .query(qryFindUserBusinessUnit);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios Unidad de Negocio encontradas' : 'No se encontraron Usuarios-Unidad de Negocio',
            userBusinessUnits: result?.recordset
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
module.exports.getAllUserBusinessUnitByName = getAllUserBusinessUnitByName;

const createUserBusinessUnit = async ( { 
    usbuUserId,
    usbuBuCode,
    usbuStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateUserBusinessUnit = `
            INSERT INTO tbl_users_business_units
                    (usbu_user_id
                    ,usbu_bu_code
                    ,usbu_creation_date
                    ,usbu_status)
            VALUES
                    (@usbuUserId
                    ,@usbuBuCode
                    ,DBO.fncGetDate()
                    ,@usbuStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usbuUserId',   sql.Int,     usbuUserId  )             
                            .input('usbuBuCode',   sql.VarChar, usbuBuCode)
                            .input('usbuStatus',   sql.VarChar, usbuStatus  )
                            .query(sqlCreateUserBusinessUnit);
        
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
module.exports.createUserBusinessUnit = createUserBusinessUnit;

const updateUserBusinessUnit = async( params,usbuUserId, usbuBuCode) => {
    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateUserBusinessUnit= `
        UPDATE tbl_users_business_units
           SET ${columnSet}
        WHERE usbu_user_id      =   @usbuUserId
          and usbu_bu_code      =   @usbuBuCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usbuUserId',     sql.Int,     usbuUserId   )             
                            .input('usbuBuCode',     sql.VarChar, usbuBuCode )
                            .query(sqlUpdateUserBusinessUnit);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUserBusinessUnit = updateUserBusinessUnit;

const deleteUserBusinessUnit = async (usbuUserId, usbuBuCode) => {
        
    try {
        
        const sqlDeleteUserBusinessUnit = `
        DELETE 
          FROM tbl_users_business_units
        WHERE usbu_user_id      =   @usbuUserId
          and usbu_bu_code      =   @usbuBuCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usbuUserId',       sql.VarChar, usbuUserId   )             
                            .input('usbuBuCode',     sql.VarChar, usbuBuCode )
                            .query(sqlDeleteUserBusinessUnit);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserBusinessUnit = deleteUserBusinessUnit;

const deleteUserBusinessUnitsByUserId = async (usbuUserId) => {
        
    try {
        
        const sqlDeleteUserBusinessUnits = `
        DELETE 
          FROM tbl_users_business_units
        WHERE usbu_user_id   =   @usbuUserId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usbuUserId',     sql.VarChar, usbuUserId )             
                            .query(sqlDeleteUserBusinessUnits);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserBusinessUnitsByUserId = deleteUserBusinessUnitsByUserId;
