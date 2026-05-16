const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const roleExists = async ( roleName ) => {

    let respuesta;
    try {
        const sqlRoleExists = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Role ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_roles t1
                   WHERE t1.role_name      =   @roleName
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('roleName',  sql.VarChar, roleName )
                            .query(sqlRoleExists);

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
module.exports.roleExists = roleExists;

const getAllRoles = async() => {

    let respuesta;
    try {
        const sqlGetAllRoles = `
          SELECT 
                 ROW_NUMBER() OVER(ORDER BY  t1.role_id ASC) AS id
                 ,t1.role_id             AS  roleId
                 ,t1.role_name           AS  roleName
                 ,t1.role_description    AS  roleDescription
                 ,t1.role_creation_date  AS  roleCreationDate
                 ,t1.role_status         AS  roleStatus
           FROM dbo.tbl_roles t1
        ORDER BY t1.role_id
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllRoles);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Roles encontrados' : 'No se encontraron roles',
            roles: result?.recordset
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
module.exports.getAllRoles = getAllRoles;


const getRoleById = async( roleId ) => {

    try {
        
        const sqlGetRoleByID = `
            SELECT 
                ROW_NUMBER() OVER(ORDER BY  t1.role_id ASC) AS id
                ,t1.role_id             AS  roleId
                ,t1.role_name           AS  roleName
                ,t1.role_description    AS  roleDescription
                ,t1.role_creation_date  AS  roleCreationDate
                ,t1.role_status         AS  roleStatus
            FROM tbl_roles t1
           WHERE t1.role_id = @roleId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('roleId', sql.Int, roleId )                            
                            .query(sqlGetRoleByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getRoleById = getRoleById;

const getAllRolesByName = async(roleName) => {

    const qryFindRole = 
    `
        SELECT 
            ROW_NUMBER() OVER(ORDER BY  t1.role_id ASC) AS id
            ,t1.role_id             AS  roleId
            ,t1.role_name           AS  roleName
            ,t1.role_description    AS  roleDescription
            ,t1.role_creation_date  AS  roleCreationDate
            ,t1.role_status         AS  roleStatus
        FROM dbo.tbl_roles t1
        WHERE (UPPER(t1.role_name)  LIKE UPPER(CONCAT('%',@roleName,'%'))
        or UPPER(t1.role_description)  LIKE UPPER(CONCAT('%',@roleName,'%')))
        AND t1.role_status = 'S'
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('roleName', sql.VarChar, roleName )
                            .query(qryFindRole);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Roles encontrados' : 'No se encontraron roles',
            roles: result?.recordset
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
module.exports.getAllRolesByName = getAllRolesByName;

const createRole = async ( { 
    roleName, 
    roleDescription,
    roleStatus} ) => {
        
    let respuesta;
    try {
        
        const sqlCreateRole = `
        INSERT INTO tbl_roles (
            role_name,
            role_description,
            role_creation_date,
            role_status
        )VALUES(
            UPPER(@roleName),
            UPPER(@roleDescription),
            DBO.fncGetDate(),
            UPPER(@roleStatus)
        )      
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('roleName',          sql.VarChar,  roleName )
                            .input('roleDescription',   sql.VarChar,  roleName )
                            .input('roleStatus',        sql.VarChar,  roleStatus )
                            .query(sqlCreateRole);
        
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
module.exports.createRole = createRole;

const updateRole = async( params, roleId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRole = `
        UPDATE tbl_roles
           SET ${columnSet}
         WHERE role_id = @roleId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('roleId',     sql.VarChar, roleId )
                            .query(sqlUpdateRole);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateRole = updateRole;

const deleteRole = async ( roleId ) => {
        
    try {
        
        const sqlDeleteRole = `
        DELETE 
          FROM tbl_roles
         WHERE role_id = @roleId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('roleId',     sql.VarChar, roleId )
                            .query(sqlDeleteRole);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRole = deleteRole;
