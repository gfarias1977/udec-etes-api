const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const facultyExists = async ( facuCode ) => {

    let respuesta;
    try {
        const sqlFacultyExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Facultad ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_faculty t1
                    WHERE t1.facu_code      =   @facuCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('facuCode',  sql.VarChar, facuCode )
                            .query(sqlFacultyExists);

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
module.exports.facultyExists = facultyExists;

const getAllFaculties = async() => {

    let respuesta;
    try {
        const sqlGetAllFaculties = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.facu_code ASC) AS id  
                ,t1.facu_code
                ,t1.facu_org_code
                ,t1.facu_name
                ,t1.facu_creation_date
                ,t1.facu_status
            FROM dbo.tbl_faculty t1
            order by t1.facu_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllFaculties);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Facultades encontrados' : 'No se encontraron Facultades',
            faculties: result?.recordset
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
module.exports.getAllFaculties = getAllFaculties;


const getFacultyById = async( facuCode) => {

    try {
        
        const sqlGetFacultyByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.facu_code ASC) AS id  
                ,t1.facu_code
                ,t1.facu_org_code
                ,t1.facu_name
                ,t1.facu_creation_date
                ,t1.facu_status
            FROM dbo.tbl_faculty t1
            WHERE t1.facu_code = @facuCode            
            order by t1.facu_code 
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('facuCode', sql.VarChar, facuCode )                            
                            .query(sqlGetFacultyByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getFacultyById = getFacultyById;

const getAllFacultyByName = async(facuName) => {

    const qryFindFaculties = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.facu_code ASC) AS id  
            ,t1.facu_code
            ,t1.facu_org_code
            ,t1.facu_name
            ,t1.facu_creation_date
            ,t1.facu_status
        FROM dbo.tbl_faculty t1
        WHERE UPPER(t1.facu_name)  LIKE UPPER(CONCAT('%',@facuName,'%'))
           AND t1.facu_status = 'S'         
        order by t1.facu_code 
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('facuName', sql.VarChar, facuName )
                            .query(qryFindFaculties);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Facultades encontradas' : 'No se encontraron Facultades',
            faculties: result?.recordset
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
module.exports.getAllFacultyByName = getAllFacultyByName;

const createFaculty = async ( { 
    facuCode,
    facuOrgCode,
    facuName,
    facuCreationDate,
    facuStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateFaculty = `
                INSERT INTO dbo.tbl_faculty
                        (facu_code
                        ,facu_org_code
                        ,facu_name
                        ,facu_creation_date
                        ,facu_status)
                VALUES
                        (@facuCode
                        ,@facuOrgCode
                        ,@facuName
                        ,DBO.fncGetDate()
                        ,@facuStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('facuCode',         sql.VarChar,  facuCode )             
                            .input('facuOrgCode',      sql.VarChar,  facuOrgCode )
                            .input('facuName',         sql.VarChar,  facuName )
                            .input('facuStatus',       sql.VarChar,  facuStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateFaculty);
        
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
module.exports.createFaculty = createFaculty;

const updateFaculty = async( params, facuCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateFaculty= `
        UPDATE tbl_faculty
           SET ${columnSet}
         WHERE facu_code = @facuCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('facuCode',     sql.VarChar, facuCode )
                            .query(sqlUpdateFaculty);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateFaculty = updateFaculty;

const deleteFaculty = async ( facuCode ) => {
        
    try {
        
        const sqlDeleteFaculty = `
        DELETE 
          FROM tbl_faculty
         WHERE facu_code = @facuCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('facuCode',     sql.VarChar, facuCode )
                            .query(sqlDeleteFaculty);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteFaculty = deleteFaculty;
