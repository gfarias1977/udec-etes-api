const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const campusExists = async ( campCode ) => {

    let respuesta;
    try {
        const sqlCampusExists = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Campus ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_campus t1
                   WHERE t1.camp_code      =   @campCode
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('campCode',  sql.VarChar, campCode )
                            .query(sqlCampusExists);

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
module.exports.campusExists = campusExists;

const getAllCampus = async(campCode) => {

    let respuesta;
    try {
        const sqlGetAllCampus = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.camp_code ASC) AS id
                ,t1.camp_code            AS campCode              
                ,t1.camp_org_code        AS campOrgCode     
                ,t1.camp_description     AS campDescription        
                ,t1.camp_type            AS campType 
                ,t1.camp_address         AS campAddress    
                ,t1.camp_department      AS campDepartment       
                ,t1.camp_city            AS campCity 
                ,t1.camp_erp_code        AS campErpCode     
                ,t1.camp_creation_date   AS campCreationDate          
                ,t1.camp_status          AS campStatus   
            FROM dbo.tbl_campus t1
            LEFT JOIN dbo.tbl_organizations t2 on t2.org_code = t1.camp_org_code
            WHERE t1.camp_org_code = COALESCE(@campCode, t1.camp_org_code)
            ORDER BY t1.camp_code desc
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('campCode',  sql.VarChar, campCode )
                            .query(sqlGetAllCampus);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Campus encontradas' : 'No se encontraron Campus',
            campus: result?.recordset
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
module.exports.getAllCampus = getAllCampus;

const createCampus = async ( { 
    campCode,
    campOrgCode,
    campDescription,
    campType,
    campAddress,
    campDepartment,
    campCity,
    campErpCode,
    campStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateCampus = `
            INSERT INTO tbl_campus
                    (camp_code
                    ,camp_org_code
                    ,camp_description
                    ,camp_type
                    ,camp_address
                    ,camp_department
                    ,camp_city
                    ,camp_erp_code
                    ,camp_creation_date
                    ,camp_status)
            VALUES
                    (UPPER(@campCode)
                    ,UPPER(@campOrgCode)
                    ,UPPER(@campDescription)
                    ,UPPER(@campType)
                    ,UPPER(@campAddress)
                    ,UPPER(@campDepartment)
                    ,UPPER(@campCity)
                    ,UPPER(@campErpCode)
                    ,DBO.fncGetDate()
                    ,UPPER(@campStatus))
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('campCode',          sql.VarChar,  campCode )             
                            .input('campOrgCode',       sql.VarChar,  campOrgCode )
                            .input('campDescription',   sql.VarChar,  campDescription )
                            .input('campType',          sql.VarChar,  campType )
                            .input('campAddress',       sql.VarChar,  campAddress )
                            .input('campDepartment',    sql.VarChar,  campDepartment )
                            .input('campCity',          sql.VarChar,  campCity )
                            .input('campErpCode',       sql.VarChar,  campErpCode )
                            .input('campStatus',        sql.VarChar,  campStatus )
                            .query(sqlCreateCampus);
        
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
module.exports.createCampus = createCampus;

const updateCampus = async( params, campCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateCampus= `
        UPDATE tbl_campus
           SET ${columnSet}
         WHERE camp_code = @campCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('campCode',     sql.VarChar, campCode )
                            .query(sqlUpdateCampus);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateCampus = updateCampus;

const deleteCampus = async ( campCode ) => {
        
    try {
        
        const sqlDeleteCampus = `
        DELETE 
          FROM tbl_campus
         WHERE camp_code = @campCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('campCode',     sql.VarChar, campCode )
                            .query(sqlDeleteCampus);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteCampus = deleteCampus;
