const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');


const getAllProcessLog = async(procId) => {

    let respuesta;
    try {
        const sqlGetAllProcessLog = `
        SELECT SELECT ROW_NUMBER() OVER(ORDER BY  t1.procl_id ASC) AS id
            ,t1.procl_id            AS  proclId           
            ,t1.procl_proc_id       AS  proclProcId      
            ,t1.procl_log           AS  proclLog          
            ,t1.procl_creation_date AS  proclCreationDate
        FROM t1.dbo].[tbl_process_logs  t1
        WHERE t1.procl_proc_id = @proclProcId`;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purclProcId',   sql.VarChar,purclProcId) 
                            .query(sqlGetAllProcessLog);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.recordset.length > 0 ? 'Log Procesos encontradas' : 'No se encontraron Log Procesos',
            processes: result?.recordset
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
module.exports.getAllProcessLog = getAllProcessLog;

const createProcessLog = async ( { 
     proclProcId
    ,proclLog
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateProcessLog = `
        INSERT INTO dbo.tbl_process_logs
                (procl_proc_id
                ,procl_log
                ,procl_creation_date
                )
        VALUES
                (@proclProcId
                ,@proclLog
                ,DBO.fncGetDate()
                )`;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('proclProcId',              sql.Numeric,proclProcId)         
                            .input('proclLog',                 sql.VarChar,proclLog)       
                            .query(sqlCreateProcessLog);
        
        const affectedRows = result.rowsAffected[0];
        //const proclId = result.recordset[0].procl_id;

        respuesta = {
            type: !affectedRows ? 'error' : 'ok',
            status: 200,
            //proclId:proclId,
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
module.exports.createProcessLog = createProcessLog;

const deleteProcessLog = async ( proclId ) => {
        
    try {
        
        const sqlDeleteProcess = `
        DELETE 
          FROM tbl_process_logs
         WHERE procl_id = @proclId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('proclId',     sql.Numeric, proclId )
                            .query(sqlDeleteProcess);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProcessLog = deleteProcessLog;
