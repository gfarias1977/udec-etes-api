
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const roleApplicationExist = async (rlapRoleId, rlapAppId ) => {

    let respuesta;
    try {
        const sqlRoleApplicationExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Rol Aplicacion ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_role_applications t1
                    WHERE t1.rlap_role_id     =   $1
                      and t1.rlap_app_id      =   $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlRoleApplicationExist, [rlapRoleId, rlapAppId]);

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
module.exports.roleApplicationExist =roleApplicationExist;

const getAllRoleApplications = async() => {

    let respuesta;
    try {
        const sqlGetAllRoleApplications = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.rlap_role_id,t1.rlap_app_id ASC) AS id 
                ,t1.rlap_role_id
                ,t1.rlap_app_id
                ,t1.rlap_creation_date
                ,t1.rlap_status
            FROM tbl_role_applications t1
            order by t1.rlap_role_id,t1.rlap_app_id
        `;

        const result = await pool.query(sqlGetAllRoleApplications);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios Area de Compra encontrados' : 'No se encontraron Usuarios Area de Compra',
            roleApplications: result?.rows
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
module.exports.getAllRoleApplications = getAllRoleApplications;


const getRoleApplicationById = async(rlapRoleId, rlapAppId) => {

    try {
        
        const sqlGetRoleApplicationByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.rlap_role_id,t1.rlap_app_id ASC) AS id 
                ,t1.rlap_role_id
                ,t1.rlap_app_id
                ,t1.rlap_creation_date
                ,t1.rlap_status
            FROM tbl_role_applications t1
            WHERE t1.rlap_role_id        =   $1
              and t1.rlap_app_id      =   $2
            order by t1.rlap_role_id,t1.rlap_app_id
        `;

        const result = await pool.query(sqlGetRoleApplicationByID, [rlapRoleId, rlapAppId]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getRoleApplicationById = getRoleApplicationById;

const getAllRoleApplicationByName = async(rlapName) => {

    const qryFindRoleApplications = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY t1.rlap_role_id,t1.rlap_app_id ASC) AS id 
            ,t1.rlap_role_id
            ,t1.rlap_app_id
            ,t1.rlap_creation_date
            ,t1.rlap_status
        FROM tbl_role_applications t1,
            tbl_roles t2,
            tbl_applications t3
        WHERE 
            t1.rlap_role_id =  t2.role_id
        and t1.rlap_app_id  = t3.app_id
        and (UPPER(t2.role_name)        LIKE UPPER(CONCAT('%',$1,'%')) OR
             UPPER(t3.app_description)  LIKE UPPER(CONCAT('%',$1,'%'))) 
        AND t1.rlap_status = 'S'            
        order by t1.rlap_role_id,t1.rlap_app_id
    `;
    
    try {
        const result = await pool.query(qryFindRoleApplications, [rlapName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Rol Aplicacion encontradas' : 'No se encontraron Rol Aplicacion',
            roleApplications: result?.rows
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
module.exports.getAllRoleApplicationByName = getAllRoleApplicationByName;

const createRoleApplication = async ( { 
    rlapRoleId,
    rlapAppId,
    rlapStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateRoleApplication = `
            INSERT INTO tbl_role_applications
                    (rlap_role_id
                    ,rlap_app_id
                    ,rlap_creation_date
                    ,rlap_status)
            VALUES
                    ($1
                    ,$2
                    ,NOW()
                    ,$3)
        `;

        const result = await pool.query(sqlCreateRoleApplication, [rlapRoleId, rlapAppId, rlapStatus]);
        
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
module.exports.createRoleApplication = createRoleApplication;

const updateRoleApplication = async( params,rlapRoleId, rlapAppId) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRoleApplication= `
        UPDATE tbl_role_applications
           SET ${columnSet}
        WHERE rlap_role_id      =   $1
           and rlap_app_id      =   $2
        `;

        const result = await pool.query(sqlUpdateRoleApplication, [rlapRoleId, rlapAppId]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateRoleApplication = updateRoleApplication;

const deleteRoleApplication = async (rlapRoleId, rlapAppId) => {
        
    try {
        
        const sqlDeleteRoleApplication = `
        DELETE 
          FROM tbl_role_applications
        WHERE rlap_role_id     =   $1
          and rlap_app_id      =   $2
        `;

        const result = await pool.query(sqlDeleteRoleApplication, [rlapRoleId, rlapAppId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRoleApplication = deleteRoleApplication;
