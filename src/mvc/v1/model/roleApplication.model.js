const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const roleApplicationExist = async (rlapRoleId, rlapAppId ) => {

    let respuesta;
    try {
        const sqlRoleApplicationExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Rol Aplicacion ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_role_applications t1
                    WHERE t1.rlap_role_id     =   @rlapRoleId
                      and t1.rlap_app_id      =   @rlapAppId
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlapRoleId', sql.Int,rlapRoleId )
                            .input('rlapAppId',  sql.Int,rlapAppId  )
                            .query(sqlRoleApplicationExist);

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
            FROM dbo.tbl_role_applications t1
            order by t1.rlap_role_id,t1.rlap_app_id
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllRoleApplications);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Usuarios Area de Compra encontrados' : 'No se encontraron Usuarios Area de Compra',
            roleApplications: result?.recordset
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
            FROM dbo.tbl_role_applications t1
            WHERE t1.rlap_role_id        =   @rlapRoleId
              and t1.rlap_app_id      =   @rlapAppId
            order by t1.rlap_role_id,t1.rlap_app_id
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlapRoleId', sql.Int,rlapRoleId )
                            .input('rlapAppId',  sql.Int,rlapAppId  )
                            .query(sqlGetRoleApplicationByID);
        
        return result?.recordset[0];
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
        FROM dbo.tbl_role_applications t1,
            dbo.tbl_roles t2,
            dbo.tbl_applications t3
        WHERE 
            t1.rlap_role_id =  t2.role_id
        and t1.rlap_app_id  = t3.app_id
        and (UPPER(t2.role_name)        LIKE UPPER(CONCAT('%',@rlapName,'%')) OR
             UPPER(t3.app_description)  LIKE UPPER(CONCAT('%',@rlapName,'%'))) 
        AND t1.rlap_status = 'S'            
        order by t1.rlap_role_id,t1.rlap_app_id
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlapName', sql.VarChar,rlapName )
                            .query(qryFindRoleApplications);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Rol Aplicacion encontradas' : 'No se encontraron Rol Aplicacion',
            roleApplications: result?.recordset
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
                    (@rlapRoleId
                    ,@rlapAppId
                    ,DBO.fncGetDate()
                    ,@rlapStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlapRoleId',    sql.Int,     rlapRoleId )             
                            .input('rlapAppId',     sql.Int,     rlapAppId  )
                            .input('rlapStatus',    sql.VarChar, rlapStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateRoleApplication);
        
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
module.exports.createRoleApplication = createRoleApplication;

const updateRoleApplication = async( params,rlapRoleId, rlapAppId) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRoleApplication= `
        UPDATE tbl_role_applications
           SET ${columnSet}
        WHERE rlap_role_id      =   @rlapRoleId
           and rlap_app_id      =   @rlapAppId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlapRoleId',    sql.Int,  rlapRoleId )             
                            .input('rlapAppId',     sql.Int,  rlapAppId  )
                            .query(sqlUpdateRoleApplication);
        
        return result?.rowsAffected[0];
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
        WHERE rlap_role_id     =   @rlapRoleId
          and rlap_app_id      =   @rlapAppId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlapRoleId',    sql.Int, rlapRoleId )             
                            .input('rlapAppId',     sql.Int, rlapAppId  )
                            .query(sqlDeleteRoleApplication);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRoleApplication = deleteRoleApplication;
