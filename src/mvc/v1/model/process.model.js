
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');


const Exist = async ( procCode ) => {

    let respuesta;
    try {
        const sqlGapScheduledExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Codigo proceso ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_process t1
                    WHERE t1.proc_code    =  $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlGapScheduledExists, [procCode]);

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
module.exports.Exist = Exist;

const getAllProcessByPurcCode= async(proctId, purcCode) => {

    let respuesta;
    try {
        const sqlGetAllProcess = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.proc_id ASC) AS id
              ,t1.proc_id                    AS "procId"    
              ,t1.proc_purc_code			 AS "procPurcCode"
              ,t2.purc_name					 AS "procPurcName"
              ,t1.proc_proct_id			     AS "procProctId"
              ,t3.proct_code				 AS "procProctCode"
              ,t3.proct_name				 AS "procProctName"
              ,t1.proc_scheduled_date		 AS "procScheduledDate"
              ,t1.proc_email_notification	 AS "procEmailNotification"
              ,t1.proc_file                  AS "procFile"
              ,t1.proc_file_uploaded         AS "procFileUploaded"
              ,t1.proc_code				     AS "procCode"
              ,t1.proc_creation_date		 AS "procCreationDate"
              ,t1.proc_stock_proc_id		 AS "procStockId"
              ,t1.proc_demand_proc_id		 AS "procDemandId"
              ,t1.proc_standard_proc_id  	 AS "procStandardId"
              ,t4.proc_code		             AS "procStock"
              ,t5.proc_code		             AS "procDemand"
              ,t6.proc_code  	             AS "procStandard" 
              ,t1.proc_status				 AS "procStatus"
          FROM tbl_process t1
          LEFT JOIN tbl_purchase_areas    t2 on t1.proc_purc_code = t2.purc_code
          LEFT JOIN tbl_process_types         t3 on t1.proc_proct_id = t3.proct_id and  t3.proct_purc_code = t1.proc_purc_code
          LEFT JOIN tbl_process               t4 on t4.proc_id = t1.proc_stock_proc_id  
          LEFT JOIN tbl_process               t5 on t5.proc_id = t1.proc_demand_proc_id  
          LEFT JOIN tbl_process               t6 on t6.proc_id = t1.proc_standard_proc_id  
          WHERE   t1.proc_purc_code = $1
              and t1.proc_proct_id  = $2
          ORDER BY t1.proc_id DESC
        `;

        const result = await pool.query(sqlGetAllProcess, [purcCode, proctId]);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.rows.length > 0 ? 'Procesos encontradas' : 'No se encontraron Procesos',
            processes: result?.rows
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
        INSERT INTO tbl_process
                (proc_id
                ,proc_purc_code
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
                ,proc_status)
        VALUES
                (nextval('tbl_process_proc_id_seq')
                ,$1
                ,$2
                ,$3
                ,$4
                ,$5
                ,$6
                ,$7                                
                ,NOW()
                ,$8
                ,$9
                ,$10
                ,$11)
                RETURNING proc_id
        `;

        const result = await pool.query(sqlCreateProcess, [procPurcCode, procProctId, procScheduledDate, procEmailNotification, procCode, procFile, procFileUploaded, procStock, procDemand, procStandard, procStatus]);
        
        const affectedRows = result.rowCount;
        const procId = result.rows[0].proc_id;

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
        UPDATE tbl_process
           SET ${columnSet}
         WHERE proc_id = $1
        `;

        const result = await pool.query(sqlUpdateProcess, [procId]);
        
        return result?.rowCount;
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
         WHERE proc_id = $1
        `;

        const result = await pool.query(sqlDeleteProcess, [procId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProcess = deleteProcess;
