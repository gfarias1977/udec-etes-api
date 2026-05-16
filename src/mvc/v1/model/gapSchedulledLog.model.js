const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const getAllGapsSchedulledLogByGapscdId= async(gapscdId) => {

    let respuesta;
    try {
        const sqlGetAllGapsSchedulledLog = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.gapscl_id ASC) AS id
            ,t1.gapscl_id             AS gapsclId     
            ,t1.gapscl_gapscd_id      AS gapsclGapscdId  
            ,t1.gapscl_log            AS gapsclLog   
            ,t1.gapscl_creation_date  AS gapsclCreationDate 
        FROM tbl_gaps_scheduled_logs t1
        WHERE t1.gapscl_gapscd_id = @gapscdId
  
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('gapscdId', sql.Numeric,gapscdId)   
                            .query(sqlGetAllGapsSchedulledLog);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.recordset.length > 0 ? 'Log Programaciones encontradas' : 'No se encontraron Log Programaciones',
            gapsSchedulledLog: result?.recordset
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
module.exports.getAllGapsSchedulledLogByGapscdId = getAllGapsSchedulledLogByGapscdId;

const createGapSchedulledLog= async ( { 
     gapsclGapscdId  
    ,gapsclLog   
    ,gapsclCreationDate
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateGapSchedulledLog = `
        INSERT INTO dbo.tbl_gaps_scheduled_logs
                (gapsclGapscdId  
                ,gapsclLog   
                ,gapsclCreationDate)
        VALUES
                (@gapsclGapscdId
                ,@gapsclLog
                ,DBO.fncGetDate()) 
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('gapsclGapscdId',             sql.Numeric,gapsclGapscdId)         
                            .input('gapsclLog',                  sql.VarChar,gapsclLog)         
                            .query(sqlCreateGapSchedulledLog);
        
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
module.exports.createGapSchedulledLog = createGapSchedulledLog;

const updateGapSchedulledLog = async( params, gapscdId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateGapSchedulledLog = `
        UPDATE dbo.tbl_gaps_scheduled_logs
           SET ${columnSet}
         WHERE gapscl_id = @gapsclId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('gapsclId', sql.Numeric, gapsclId )
                            .query(sqlUpdateGapSchedulledLog);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateGapSchedulledLog = updateGapSchedulledLog;

const deleteGapSchedulledLog = async ( gapscdId) => {
        
    try {
        
        const sqlDeleteGapSchedulledLog  = `
        DELETE 
          FROM tbl_gaps_scheduled_logs
         WHERE gapscl_id = @gapsclId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('gapsclId',     sql.Numeric, gapsclId )
                            .query(sqlDeleteGapSchedulledLog );
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteGapSchedulledLog = deleteGapSchedulledLog;
