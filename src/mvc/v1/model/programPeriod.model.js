const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const programPeriodExist = async (propCode ) => {

    let respuesta;
    try {
        const sqlProgramPeriodExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Periodo de Programa ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_programs_periods t1
                    WHERE t1.prop_code      =   @propCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('propCode',  sql.VarChar,propCode )
                            .query(sqlProgramPeriodExist);

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
module.exports.programPeriodExist = programPeriodExist;

const getAllProgramPeriods = async() => {

    let respuesta;
    try {
        const sqlGetAllProgramPeriods = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.prop_code ASC) AS id   
                ,t1.prop_code
                ,t1.prop_name
                ,t1.prop_creation_date
                ,t1.prop_status
            FROM dbo.tbl_programs_periods t1
            order by t1.prop_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllProgramPeriods);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Periodo de Programa encontrados' : 'No se encontraron Periodo de Programa',
            programPeriods: result?.recordset
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
module.exports.getAllProgramPeriods = getAllProgramPeriods;


const getProgramPeriodById = async(propCode) => {

    try {
        
        const sqlGetLevelByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.prop_code ASC) AS id   
                ,t1.prop_code
                ,t1.prop_name
                ,t1.prop_creation_date
                ,t1.prop_status
            FROM dbo.tbl_programs_periods t1
            WHERE t1.prop_code = @propCode 
            order by t1.prop_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('propCode', sql.VarChar,propCode )                            
                            .query(sqlGetLevelByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getProgramPeriodById = getProgramPeriodById;

const getAllProgamTypeByName = async(propName) => {

    const qryFindProgramPeriods = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.prop_code ASC) AS id   
            ,t1.prop_code
            ,t1.prop_name
            ,t1.prop_creation_date
            ,t1.prop_status
        FROM dbo.tbl_programs_periods t1
        WHERE UPPER(t1.prop_name)  LIKE UPPER(CONCAT('%',@propName,'%'))
        AND t1.prop_status = 'S'   
        order by t1.prop_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('propName', sql.VarChar, propName )
                            .query(qryFindProgramPeriods);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Periodo de Programa encontradas' : 'No se encontraron Periodo de Programa',
            programPeriods: result?.recordset
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
module.exports.getAllProgamTypeByName = getAllProgamTypeByName;

const createProgramPeriod = async ( { 
    propCode,
    propName,
    propStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateProgramPeriod = `
                INSERT INTO dbo.tbl_programs_periods
                        ( prop_code
                         ,prop_name
                         ,prop_creation_date
                         ,prop_status)
                VALUES
                        (@propCode
                        ,@propName
                        ,DBO.fncGetDate()
                        ,@propStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('propCode',   sql.VarChar,  propCode   )             
                            .input('propName',   sql.VarChar,  propName   )
                            .input('propStatus', sql.VarChar,  propStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateProgramPeriod);
        
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
module.exports.createProgramPeriod = createProgramPeriod;

const updateProgramPeriod = async( params,propCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateProgramPeriod= `
        UPDATE tbl_programs_periods
           SET ${columnSet}
         WHERE prop_code = @propCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('propCode',     sql.VarChar,propCode )
                            .query(sqlUpdateProgramPeriod);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateProgramPeriod = updateProgramPeriod;

const deleteProgramPeriod = async (propCode) => {
        
    try {
        
        const sqlDeleteProgramPeriod = `
        DELETE 
          FROM tbl_programs_periods
         WHERE prop_code = @propCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('propCode',     sql.VarChar,propCode )
                            .query(sqlDeleteProgramPeriod);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProgramPeriod = deleteProgramPeriod;
