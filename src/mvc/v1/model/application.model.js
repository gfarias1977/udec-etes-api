const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const applicationExists = async ( appCode ) => {

    let respuesta;
    try {
        const sqlApplicationExists = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Aplicacion ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_applications t1
                   WHERE t1.app_code      =   @appCode
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('appCode',  sql.VarChar, appCode )
                            .query(sqlApplicationExists);

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
module.exports.applicationExists = applicationExists;

const getAllApplications = async() => {

    let respuesta;
    try {
        const sqlGetAllApplications = `
            SELECT
                    ROW_NUMBER() OVER(ORDER BY  t1.app_id ASC) AS id
                ,t1.app_id
                ,t1.app_code
                ,t1.app_description
                ,t1.app_creation_date
                ,t1.app_parent_id
                ,t1.app_menu_display
                ,t1.app_url
                ,t1.app_order
                ,t1.app_component
                ,t1.app_alt
                ,t1.app_status
            FROM dbo.tbl_applications t1
            ORDER BY t1.app_id
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllApplications);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Aplicaciones encontradas' : 'No se encontraron Aplicaciones',
            applications: result?.recordset
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
module.exports.getAllApplications = getAllApplications;


const getApplicationById = async( appId ) => {

    try {
        
        const sqlGetAplicationByID = `
            SELECT
                    ROW_NUMBER() OVER(ORDER BY  t1.app_id ASC) AS id
                ,t1.app_id
                ,t1.app_code
                ,t1.app_description
                ,t1.app_creation_date
                ,t1.app_parent_id
                ,t1.app_menu_display
                ,t1.app_url
                ,t1.app_order
                ,t1.app_component
                ,t1.app_alt
                ,t1.app_status
            FROM dbo.tbl_applications t1
            WHERE t1.app_id = @appId
            ORDER BY t1.app_id
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('appId', sql.Int, appId )                            
                            .query(sqlGetAplicationByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getApplicationById = getApplicationById;

const getAllApplicationsByName = async(appDescription) => {

    const qryFindApplication = 
    `
        SELECT
                ROW_NUMBER() OVER(ORDER BY  t1.app_id ASC) AS id
            ,t1.app_id
            ,t1.app_code
            ,t1.app_description
            ,t1.app_creation_date
            ,t1.app_parent_id
            ,t1.app_menu_display
            ,t1.app_url
            ,t1.app_order
            ,t1.app_component
            ,t1.app_alt
            ,t1.app_status
        FROM dbo.tbl_applications t1
        WHERE UPPER(t1.app_description)  LIKE UPPER(CONCAT('%',@appDescription,'%'))
            AND t1.app_status = 'S'
        ORDER BY t1.app_id
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('appDescription', sql.VarChar, appDescription )
                            .query(qryFindApplication);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Aplicaciones encontrados' : 'No se encontraron Aplicaciones',
            applications: result?.recordset
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
module.exports.getAllApplicationsByName = getAllApplicationsByName;

const createApplication = async ( { 
    appCode,
    appDescription,
    appParentId,
    appMenuDisplay,
    appUrl,
    appOrder,
    appComponent,
    appAlt,
    appStatus} ) => {
        
    let respuesta;
    try {
        
        const sqlCreateApplication = `
            INSERT INTO dbo.tbl_applications
                    (app_code
                    ,app_description
                    ,app_creation_date
                    ,app_parent_id
                    ,app_menu_display
                    ,app_url
                    ,app_order
                    ,app_component
                    ,app_alt
                    ,app_status)
            VALUES
                    (UPPER(@appCode)
                    ,UPPER(@appDescription)
                    ,DBO.fncGetDate()
                    ,@appParentId
                    ,UPPER(@appMenuDisplay)
                    ,UPPER(@appUrl)
                    ,@appOrder
                    ,UPPER(@appComponent)
                    ,UPPER(@appAlt)
                    ,UPPER(@appStatus))
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('appCode',          sql.VarChar,  appCode )             
                            .input('appDescription',   sql.VarChar,  appDescription )
                            .input('appParentId',      sql.Int,      appParentId )
                            .input('appMenuDisplay',   sql.VarChar,  appMenuDisplay )
                            .input('appUrl',           sql.VarChar,  appUrl )
                            .input('appOrder',         sql.Int,      appOrder )
                            .input('appComponent',     sql.VarChar,  appComponent )
                            .input('appAlt',           sql.VarChar,  appAlt )
                            .input('appStatus',        sql.VarChar,  appStatus )
                            .query(sqlCreateApplication);
        
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
module.exports.createApplication = createApplication;

const updateApplication = async( params, appId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateApplication= `
        UPDATE tbl_applications
           SET ${columnSet}
         WHERE app_id = @appId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('appId',     sql.VarChar, appId )
                            .query(sqlUpdateApplication);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateApplication = updateApplication;

const deleteApplication = async ( appId ) => {
        
    try {
        
        const sqlDeleteApplication = `
        DELETE 
          FROM tbl_applications
         WHERE app_id = @appId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('appId',     sql.VarChar, appId )
                            .query(sqlDeleteApplication);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteApplication = deleteApplication;
