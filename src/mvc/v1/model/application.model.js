
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const applicationExists = async ( appCode ) => {

    let respuesta;
    try {
        const sqlApplicationExists = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Aplicacion ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_applications t1
                   WHERE t1.app_code      =   $1
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlApplicationExists, [appCode]);

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
            FROM tbl_applications t1
            ORDER BY t1.app_id
        `;

        const result = await pool.query(sqlGetAllApplications);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Aplicaciones encontradas' : 'No se encontraron Aplicaciones',
            applications: result?.rows
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
            FROM tbl_applications t1
            WHERE t1.app_id = $1
            ORDER BY t1.app_id
        `;

        const result = await pool.query(sqlGetAplicationByID, [appId]);
        
        return result?.rows[0];
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
        FROM tbl_applications t1
        WHERE UPPER(t1.app_description)  LIKE UPPER(CONCAT('%',$1,'%'))
            AND t1.app_status = 'S'
        ORDER BY t1.app_id
    `;
    
    try {
        const result = await pool.query(qryFindApplication, [appDescription]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Aplicaciones encontrados' : 'No se encontraron Aplicaciones',
            applications: result?.rows
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
            INSERT INTO tbl_applications
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
                    (UPPER($1)
                    ,UPPER($2)
                    ,NOW()
                    ,$3
                    ,UPPER($4)
                    ,UPPER($5)
                    ,$6
                    ,UPPER($7)
                    ,UPPER($8)
                    ,UPPER($9))
        `;

        const result = await pool.query(sqlCreateApplication, [appCode, appDescription, appParentId, appMenuDisplay, appUrl, appOrder, appComponent, appAlt, appStatus]);
        
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
module.exports.createApplication = createApplication;

const updateApplication = async( params, appId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateApplication= `
        UPDATE tbl_applications
           SET ${columnSet}
         WHERE app_id = $1
        `;

        const result = await pool.query(sqlUpdateApplication, [appId]);
        
        return result?.rowCount;
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
         WHERE app_id = $1
        `;

        const result = await pool.query(sqlDeleteApplication, [appId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteApplication = deleteApplication;
