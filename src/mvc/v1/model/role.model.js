
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const roleExists = async ( roleName ) => {

    let respuesta;
    try {
        const sqlRoleExists = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Role ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_roles t1
                   WHERE t1.role_name      =   $1
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlRoleExists, [roleName]);

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
module.exports.roleExists = roleExists;

const getAllRoles = async() => {

    let respuesta;
    try {
        const sqlGetAllRoles = `
          SELECT 
                 ROW_NUMBER() OVER(ORDER BY  t1.role_id ASC) AS id
                 ,t1.role_id             AS "roleId"
                 ,t1.role_name           AS "roleName"
                 ,t1.role_description    AS "roleDescription"
                 ,t1.role_creation_date  AS "roleCreationDate"
                 ,t1.role_status         AS "roleStatus"
           FROM tbl_roles t1
        ORDER BY t1.role_id
        `;

        const result = await pool.query(sqlGetAllRoles);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Roles encontrados' : 'No se encontraron roles',
            roles: result?.rows
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
                ,t1.role_id             AS "roleId"
                ,t1.role_name           AS "roleName"
                ,t1.role_description    AS "roleDescription"
                ,t1.role_creation_date  AS "roleCreationDate"
                ,t1.role_status         AS "roleStatus"
            FROM tbl_roles t1
           WHERE t1.role_id = $1
        `;

        const result = await pool.query(sqlGetRoleByID, [roleId]);
        
        return result?.rows[0];
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
            ,t1.role_id             AS "roleId"
            ,t1.role_name           AS "roleName"
            ,t1.role_description    AS "roleDescription"
            ,t1.role_creation_date  AS "roleCreationDate"
            ,t1.role_status         AS "roleStatus"
        FROM tbl_roles t1
        WHERE (UPPER(t1.role_name)  LIKE UPPER(CONCAT('%',$1,'%'))
        or UPPER(t1.role_description)  LIKE UPPER(CONCAT('%',$1,'%')))
        AND t1.role_status = 'S'
    `;
    
    try {
        const result = await pool.query(qryFindRole, [roleName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Roles encontrados' : 'No se encontraron roles',
            roles: result?.rows
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
            UPPER($1),
            UPPER($2),
            NOW(),
            UPPER($3)
        )      
        `;

        const result = await pool.query(sqlCreateRole, [roleName, roleName, roleStatus]);
        
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
module.exports.createRole = createRole;

const updateRole = async( params, roleId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRole = `
        UPDATE tbl_roles
           SET ${columnSet}
         WHERE role_id = $1
        `;

        const result = await pool.query(sqlUpdateRole, [roleId]);
        
        return result?.rowCount;
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
         WHERE role_id = $1
        `;

        const result = await pool.query(sqlDeleteRole, [roleId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRole = deleteRole;
