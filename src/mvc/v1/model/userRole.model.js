const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const UserRoleExist = async (usroUserId, usroRoleId ) => {

    let respuesta;
    try {
        const sqlUserRoleExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Usuario Rol ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_user_roles t1
                    WHERE t1.usro_user_id    =   @usroUserId
                    and t1.usro_role_id      =   @usroRoleId
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usroUserId',  sql.Int,usroUserId )
                            .input('usroRoleId',  sql.VarChar,usroRoleId )
                            .query(sqlUserRoleExist);

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
module.exports.UserRoleExist =UserRoleExist;

const getAllUserRoles = async() => {

    let respuesta;
    try {
        const sqlGetAllUserRoles = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usro_user_id,t1.usro_role_id ASC) AS id 
                ,t1.usro_user_id AS usroUserId
                ,t1.usro_role_id AS usroRoleId
                ,t2.role_name AS usroRoleName
                ,t2.role_description AS usroRoleDescription
                ,t1.usro_creation_date AS usroCreationDate
                ,t1.usro_status AS usroStatus
            FROM dbo.tbl_user_roles t1,
                 dbo.tbl_roles t2
            WHERE t1.usro_role_id = t2.role_id 
            order by t2.role_description
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllUserRoles);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios Rol encontrados' : 'No se encontraron Usuarios Rol',
            userRoles: result?.recordset
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
module.exports.getAllUserRoles = getAllUserRoles;


const getUserRolesById = async(usroUserId) => {

    try {
        
        const sqlGetUserRoleByID = `
        SELECT ROW_NUMBER() OVER(ORDER BY t2.usro_user_id,t2.usro_role_id ASC) AS id 
            ,coalesce(t2.usro_user_id,@usroUserId) as usroUserId
            ,t1.role_id usroRoleId
            ,t1.role_name as usroRoleName
            ,t1.role_description AS usroRoleDescription
            ,coalesce(t2.usro_status, 'N') as usroAsigned
            ,coalesce(t2.usro_status,t1.role_status) as usroStatus
        FROM dbo.tbl_roles t1
            left join dbo.tbl_user_roles t2 on t2.usro_role_id = t1.role_id  
            and t2.usro_user_id = @usroUserId
        ORDER BY t1.role_description, coalesce(t2.usro_status, 'N') 
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usroUserId',    sql.Int,    usroUserId   )
                            .query(sqlGetUserRoleByID);
        
            respuesta = {
                type: 'ok',
                status: 200,
                message: result?.recordset.length > 0 ? 'Usuario Roles encontrados' : 'No se encontraron Usuario Roles',
                userRoles: result?.recordset
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

module.exports.getUserRolesById = getUserRolesById;


const getAllUserRoleByName = async(usroName) => {

    const qryFindUserRoles = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY t1.usro_user_id,t1.usro_role_id ASC) AS id 
            ,t1.usro_user_id AS usroUserId
            ,t1.usro_role_id AS usroRoleName
            ,t3.role_name AS usroRoleName
            ,t3.role_description AS usroRoleDescription
            ,t1.usro_creation_date AS usroCreationDate
            ,t1.usro_status AS  usroStatus
        FROM dbo.tbl_user_roles t1,
            dbo.tbl_user t2,
            dbo.tbl_roles t3
        WHERE 
            t1.usro_user_id = t2.user_id
        and t1.usro_role_id = t3.role_id
        and (UPPER(t2.user_first_name)  LIKE UPPER(CONCAT('%',@usroName,'%')) OR
        UPPER(t3.role_name)  LIKE UPPER(CONCAT('%',@usroName,'%'))) 
        AND t1.usro_status = 'S'            
        order by ,t3.role_description
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usroName', sql.VarChar,usroName )
                            .query(qryFindUserRoles);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios Rol encontradas' : 'No se encontraron Usuarios Rol',
            userRoles: result?.recordset
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
module.exports.getAllUserRoleByName = getAllUserRoleByName;

const createUserRole = async ( { 
    usroUserId,
    usroRoleId,
    usroStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateUserRole = `
            INSERT INTO tbl_user_roles
                    (usro_user_id
                    ,usro_role_id
                    ,usro_creation_date
                    ,usro_status)
            VALUES
                    (@usroUserId
                    ,@usroRoleId
                    ,DBO.fncGetDate()
                    ,@usroStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usroUserId',     sql.VarChar, usroUserId   )             
                            .input('usroRoleId',     sql.VarChar, usroRoleId   )
                            .input('usroStatus',     sql.VarChar, usroStatus   )                                                                                                                                                                                                                                
                            .query(sqlCreateUserRole);
        
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
module.exports.createUserRole = createUserRole;

const updateUserRole = async( params,usroUserId, usroRoleId) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateUserRole= `
        UPDATE tbl_user_roles
           SET ${columnSet}
        WHERE usro_user_id       =   @usroUserId
           and usro_role_id      =   @usroRoleId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usroUserId',     sql.VarChar, usroUserId )             
                            .input('usroRoleId',     sql.VarChar, usroRoleId )
                            .query(sqlUpdateUserRole);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUserRole = updateUserRole;

const deleteUserRole = async (usroUserId, usroRoleId) => {
        
    try {
        
        const sqlDeleteUserRole = `
        DELETE 
          FROM tbl_user_roles
        WHERE usro_user_id         =   @usroUserId
          and usro_role_id      =   @usroRoleId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usroUserId',     sql.VarChar, usroUserId )             
                            .input('usroRoleId',     sql.VarChar, usroRoleId )
                            .query(sqlDeleteUserRole);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserRole = deleteUserRole;

const deleteUserRoleByUserId = async (usroUserId) => {
        
    try {
        
        const sqlDeleteUserRole = `
        DELETE 
          FROM tbl_user_roles
        WHERE usro_user_id         =   @usroUserId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('usroUserId',     sql.VarChar, usroUserId )             
                            .query(sqlDeleteUserRole);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserRoleByUserId = deleteUserRoleByUserId;

