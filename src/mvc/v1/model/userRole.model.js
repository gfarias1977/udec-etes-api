
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const UserRoleExist = async (usroUserId, usroRoleId ) => {

    let respuesta;
    try {
        const sqlUserRoleExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Usuario Rol ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_user_roles t1
                    WHERE t1.usro_user_id    =   $1
                    and t1.usro_role_id      =   $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlUserRoleExist, [usroUserId, usroRoleId]);

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
module.exports.UserRoleExist =UserRoleExist;

const getAllUserRoles = async() => {

    let respuesta;
    try {
        const sqlGetAllUserRoles = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usro_user_id,t1.usro_role_id ASC) AS id 
                ,t1.usro_user_id AS "usroUserId"
                ,t1.usro_role_id AS "usroRoleId"
                ,t2.role_name AS "usroRoleName"
                ,t2.role_description AS "usroRoleDescription"
                ,t1.usro_creation_date AS "usroCreationDate"
                ,t1.usro_status AS "usroStatus"
            FROM tbl_user_roles t1,
                 tbl_roles t2
            WHERE t1.usro_role_id = t2.role_id 
            order by t2.role_description
        `;

        const result = await pool.query(sqlGetAllUserRoles);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios Rol encontrados' : 'No se encontraron Usuarios Rol',
            userRoles: result?.rows
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
            ,coalesce(t2.usro_user_id,$1) as usroUserId
            ,t1.role_id usroRoleId
            ,t1.role_name as usroRoleName
            ,t1.role_description AS "usroRoleDescription"
            ,coalesce(t2.usro_status, 'N') as usroAsigned
            ,coalesce(t2.usro_status,t1.role_status) as usroStatus
        FROM tbl_roles t1
            left join tbl_user_roles t2 on t2.usro_role_id = t1.role_id  
            and t2.usro_user_id = $1
        ORDER BY t1.role_description, coalesce(t2.usro_status, 'N') 
        `;

        const result = await pool.query(sqlGetUserRoleByID, [usroUserId]);
        
            respuesta = {
                type: 'ok',
                status: 200,
                message: result?.rows.length > 0 ? 'Usuario Roles encontrados' : 'No se encontraron Usuario Roles',
                userRoles: result?.rows
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
            ,t1.usro_user_id AS "usroUserId"
            ,t1.usro_role_id AS "usroRoleName"
            ,t3.role_name AS "usroRoleName"
            ,t3.role_description AS "usroRoleDescription"
            ,t1.usro_creation_date AS "usroCreationDate"
            ,t1.usro_status AS "usroStatus"
        FROM tbl_user_roles t1,
            tbl_user t2,
            tbl_roles t3
        WHERE 
            t1.usro_user_id = t2.user_id
        and t1.usro_role_id = t3.role_id
        and (UPPER(t2.user_first_name)  LIKE UPPER(CONCAT('%',$1,'%')) OR
        UPPER(t3.role_name)  LIKE UPPER(CONCAT('%',$1,'%'))) 
        AND t1.usro_status = 'S'            
        order by ,t3.role_description
    `;
    
    try {
        const result = await pool.query(qryFindUserRoles, [usroName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios Rol encontradas' : 'No se encontraron Usuarios Rol',
            userRoles: result?.rows
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
                    ($1
                    ,$2
                    ,NOW()
                    ,$3)
        `;

        const result = await pool.query(sqlCreateUserRole, [usroUserId, usroRoleId, usroStatus]);
        
        const affectedRows = result.rowCount;

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
        WHERE usro_user_id       =   $1
           and usro_role_id      =   $2
        `;

        const result = await pool.query(sqlUpdateUserRole, [usroUserId, usroRoleId]);
        
        return result?.rowCount;
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
        WHERE usro_user_id         =   $1
          and usro_role_id      =   $2
        `;

        const result = await pool.query(sqlDeleteUserRole, [usroUserId, usroRoleId]);
        
        const affectedRows = result.rowCount;

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
        WHERE usro_user_id         =   $1
        `;

        const result = await pool.query(sqlDeleteUserRole, [usroUserId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserRoleByUserId = deleteUserRoleByUserId;

