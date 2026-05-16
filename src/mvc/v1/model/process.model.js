const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');


const Exist = async ( procCode ) => {

    let respuesta;
    try {
        const sqlGapScheduledExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Codigo proceso ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_process t1
                    WHERE t1.proc_code    =  @procCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('procCode',  sql.VarChar, procCode )
                            .query(sqlGapScheduledExists);

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
module.exports.Exist = Exist;

const getAllProcessByPurcCode= async(proctId, purcCode) => {

    let respuesta;
    try {
        const sqlGetAllProcess = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.proc_id ASC) AS id
              ,t1.proc_id                    AS procId    
              ,t1.proc_purc_code			 AS procPurcCode
              ,t2.purc_name					 AS procPurcName
              ,t1.proc_proct_id			     AS procProctId
              ,t3.proct_code				 AS procProctCode
              ,t3.proct_name				 AS procProctName
              ,t1.proc_scheduled_date		 AS procScheduledDate
              ,t1.proc_email_notification	 AS procEmailNotification
              ,t1.proc_file                  AS procFile
              ,t1.proc_file_uploaded         AS procFileUploaded
              ,t1.proc_code				     AS procCode
              ,t1.proc_creation_date		 AS procCreationDate
              ,t1.proc_stock_proc_id		 AS procStockId
              ,t1.proc_demand_proc_id		 AS procDemandId
              ,t1.proc_standard_proc_id  	 AS procStandardId
              ,t4.proc_code		             AS procStock
              ,t4.proc_msg		             AS procStockMsg
              ,t5.proc_code		             AS procDemand
              ,t5.proc_msg		             AS procDemandMsg
              ,t6.proc_code  	             AS procStandard 
              ,t6.proc_msg  	             AS procStandardMsg              
              ,t1.proc_status				 AS procStatus
              ,t1.proc_msg   				 AS procMsg
          FROM dbo.tbl_process t1
          LEFT JOIN dbo.tbl_purchase_areas    t2 on t1.proc_purc_code = t2.purc_code
          LEFT JOIN tbl_process_types         t3 on t1.proc_proct_id = t3.proct_id and  t3.proct_purc_code = t1.proc_purc_code
          LEFT JOIN tbl_process               t4 on t4.proc_id = t1.proc_stock_proc_id  
          LEFT JOIN tbl_process               t5 on t5.proc_id = t1.proc_demand_proc_id  
          LEFT JOIN tbl_process               t6 on t6.proc_id = t1.proc_standard_proc_id  
          WHERE   t1.proc_purc_code = @purcCode
              and t1.proc_proct_id  = @proctId
          ORDER BY t1.proc_id DESC
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode',             sql.VarChar,purcCode) 
                            .input('proctId',              sql.BigInt,proctId) 
                            .query(sqlGetAllProcess);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.recordset.length > 0 ? 'Procesos encontradas' : 'No se encontraron Procesos',
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
module.exports.getAllProcessByPurcCode = getAllProcessByPurcCode;

const createProcess = async ( { 
     procPurcCode
    ,procProctId
    ,procScheduledDate
    ,procEmailNotification
    ,procCode
    ,procFile
    ,procFileUploaded
    ,procStatus
    ,procStock
    ,procDemand
    ,procStandard
    ,procMsg
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateProcess= `
        INSERT INTO dbo.tbl_process
                (proc_purc_code
                ,proc_proct_id
                ,proc_scheduled_date
                ,proc_email_notification
                ,proc_code
                ,proc_file
                ,proc_file_uploaded                                
                ,proc_creation_date
                ,proc_stock_proc_id		
                ,proc_demand_proc_id		 
                ,proc_standard_proc_id  
                ,proc_msg	
                ,proc_status)
        VALUES
                (@procPurcCode
                ,@procProctId
                ,@procScheduledDate
                ,@procEmailNotification
                ,@procCode
                ,@procFile
                ,@procFileUploaded                                
                ,DBO.fncGetDate()
                ,@procStock
                ,@procDemand
                ,@procStandard
                ,@procMsg
                ,@procStatus)
                SELECT SCOPE_IDENTITY() as proc_id
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('procPurcCode',             sql.VarChar,procPurcCode)         
                            .input('procProctId',              sql.Numeric,procProctId)         
                            .input('procScheduledDate',        sql.Date,procScheduledDate)       
                            .input('procEmailNotification',    sql.VarChar,procEmailNotification)
                            .input('procCode',                 sql.VarChar,procCode) 
                            .input('procFile',                 sql.VarChar,procFile) 
                            .input('procFileUploaded',         sql.VarChar,procFileUploaded) 
                            .input('procStock',                sql.Numeric,procStock)    
                            .input('procDemand',               sql.Numeric,procDemand)    
                            .input('procStandard',             sql.Numeric,procStandard)  
                            .input('procMsg',                  sql.VarChar,procMsg)   
                            .input('procStatus',               sql.VarChar,procStatus)     
                            .query(sqlCreateProcess);
        
        const affectedRows = result.rowsAffected[0];
        const procId = result.recordset[0].proc_id;

        respuesta = {
            type: !affectedRows ? 'error' : 'ok',
            status: 200,
            procId:procId,
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
module.exports.createProcess = createProcess;

const updateProcess = async( params, procId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateProcess = `
        UPDATE dbo.tbl_process
           SET ${columnSet}
         WHERE proc_id = @procId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('procId', sql.Numeric, procId )
                            .query(sqlUpdateProcess);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateProcess = updateProcess;

const deleteProcess = async ( procId ) => {
        
    try {
        
        const sqlDeleteProcess = `
        DELETE 
          FROM tbl_process
         WHERE proc_id = @procId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('procId',     sql.Numeric, procId )
                            .query(sqlDeleteProcess);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProcess = deleteProcess;
