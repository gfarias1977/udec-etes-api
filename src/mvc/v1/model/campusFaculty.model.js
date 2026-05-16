const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const campusFacultyExists = async ( cfacFacuCode, cfacCampCode, cfacOrgCode  ) => {

    let respuesta;
    try {
        const sqlCampusFacultyExists = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Sede - Facultad ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_campus_faculty t1
                   WHERE t1.cfac_facu_code      =   @cfacFacuCode
                     AND t1.cfac_camp_code      =   @cfacCampCode
                     AND t1.cfac_org_code       =   @cfacOrgCode
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('cfacFacuCode',  sql.VarChar, cfacFacuCode )
                            .input('cfacCampCode',  sql.VarChar, cfacCampCode )
                            .input('cfacOrgCode',   sql.VarChar, cfacOrgCode )
                            .query(sqlCampusFacultyExists);

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
module.exports.campusFacultyExists = campusFacultyExists;

const getAllCampusFaculty = async() => {

    let respuesta;
    try {
        const sqlGetAllCampusFaculty = `
            SELECT
                    ROW_NUMBER() OVER(ORDER BY  t1.cfac_facu_code,t1.cfac_camp_code,t1.cfac_org_code  ASC) AS id
                ,t3.facu_name 
                ,t1.cfac_facu_code
                ,t2.camp_description
                ,t1.cfac_camp_code
                ,t4.org_description
                ,t1.cfac_org_code
                ,t1.cfac_creation_date
                ,t1.cfac_status
            FROM dbo.tbl_campus_faculty t1, dbo.tbl_campus t2, dbo.tbl_faculty t3, dbo.tbl_organizations t4
                WHERE t1.cfac_facu_code = t3.facu_code
                AND t1.cfac_camp_code = t2.camp_code
                AND t1.cfac_org_code =  t4.org_code
                AND t3.facu_org_code = t4.org_code
                AND t2.camp_org_code = t4.org_code
            order by t1.cfac_facu_code,t1.cfac_camp_code,t1.cfac_org_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllCampusFaculty);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Sede-Facultad encontradas' : 'No se encontraron Sede - Facultad',
            campusFaculty: result?.recordset
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
module.exports.getAllCampusFaculty = getAllCampusFaculty;


const getCampusFacultyById = async( cfacFacuCode, cfacCampCode, cfacOrgCode ) => {

    try {
        
        const sqlGetCampusFacultyByID = `
                SELECT
                     ROW_NUMBER() OVER(ORDER BY  t1.cfac_facu_code,t1.cfac_camp_code,t1.cfac_org_code  ASC) AS id
                    ,t3.facu_name 
                    ,t1.cfac_facu_code
                    ,t2.camp_description
                    ,t1.cfac_camp_code
                    ,t4.org_description
                    ,t1.cfac_org_code
                    ,t1.cfac_creation_date
                    ,t1.cfac_status
                FROM dbo.tbl_campus_faculty t1, dbo.tbl_campus t2, dbo.tbl_faculty t3, dbo.tbl_organizations t4
                    WHERE t1.cfac_facu_code = t3.facu_code
                    AND t1.cfac_camp_code = t2.camp_code
                    AND t1.cfac_org_code =  t4.org_code
                    AND t3.facu_org_code = t4.org_code
                    AND t2.camp_org_code = t4.org_code
                    AND t1.cfac_facu_code = coalesce(@cfacFacuCode,t1.cfac_facu_code)
                    AND t1.cfac_camp_code = coalesce(@cfacCampCode,t1.cfac_camp_code)
                    AND t1.cfac_org_code = coalesce(@cfacOrgCode,t1.cfac_org_code)
                order by t1.cfac_facu_code,t1.cfac_camp_code,t1.cfac_org_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('cfacFacuCode', sql.VarChar, cfacFacuCode )                            
                            .input('cfacCampCode', sql.VarChar, cfacCampCode )                            
                            .input('cfacOrgCode',  sql.VarChar, cfacOrgCode )                            
                            .query(sqlGetCampusFacultyByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getCampusFacultyById = getCampusFacultyById;

const createCampusFaculty = async ( { 
    cfacFacuCode,
    cfacCampCode,
    cfacOrgCode,
    cfacStatus
}) => {
        
    let respuesta;
    try {
        
        const sqlCreateCampusFaculty = `
                INSERT INTO dbo.tbl_campus_faculty
                        (cfac_facu_code
                        ,cfac_camp_code
                        ,cfac_org_code
                        ,cfac_creation_date
                        ,cfac_status)
                VALUES
                        (@cfacFacuCode
                        ,@cfacCampCode
                        ,@cfacOrgCode
                        ,DBO.fncGetDate()
                        ,@cfacStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('cfacFacuCode',   sql.VarChar,  cfacFacuCode )             
                            .input('cfacCampCode',   sql.VarChar,  cfacCampCode )
                            .input('cfacOrgCode',   sql.VarChar,  cfacOrgCode )
                            .input('cfacStatus',     sql.VarChar,  cfacStatus )
                            .query(sqlCreateCampusFaculty);
        
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
module.exports.createCampusFaculty = createCampusFaculty;

const updateCampusFaculty = async( params, cfacFacuCode, cfacCampCode, cfacOrgCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateCampusFaculty= `
        UPDATE tbl_campus_faculty
           SET ${columnSet}
        WHERE cfac_facu_code = @cfacFacuCode
          AND cfac_camp_code = @cfacCampCode
          AND cfac_org_code  = @cfacOrgCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('cfacFacuCode',  sql.VarChar, cfacFacuCode )
                            .input('cfacCampCode',  sql.VarChar, cfacCampCode )
                            .input('cfacOrgCode',   sql.VarChar, cfacOrgCode )                            
                            .query(sqlUpdateCampusFaculty);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateCampusFaculty = updateCampusFaculty;

const deleteCampusFaculty = async ( cfacFacuCode, cfacCampCode, cfacOrgCode ) => {
        
    try {
        
        const sqlDeleteCampusFaculty = `
        DELETE 
          FROM tbl_campus_faculty
         WHERE cfac_facu_code = @cfacFacuCode
           AND cfac_camp_code = @cfacCampCode
           AND cfac_org_code  = @cfacOrgCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('cfacFacuCode',   sql.VarChar, cfacFacuCode )
                            .input('cfacCampCode',   sql.VarChar, cfacCampCode )
                            .input('cfacOrgCode',    sql.VarChar, cfacOrgCode )
                            .query(sqlDeleteCampusFaculty);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteCampusFaculty = deleteCampusFaculty;
