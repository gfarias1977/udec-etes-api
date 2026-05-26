
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');


const getAllProcessLog = async(procId) => {

    let respuesta;
    try {
        const sqlGetAllProcessLog = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.procl_id ASC) AS id
            ,t1.procl_id            AS "proclId"           
            ,t1.procl_proc_id       AS "proclProcId"      
            ,t1.procl_log           AS "proclLog"          
            ,t1.procl_creation_date AS "proclCreationDate"
        FROM tbl_process_logs t1
        WHERE t1.procl_proc_id = $1`;

        const result = await pool.query(sqlGetAllProcessLog, [procId]);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.rows.length > 0 ? 'Log Procesos encontradas' : 'No se encontraron Log Procesos',
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
module.exports.getAllProcessLog = getAllProcessLog;

const createProcessLog = async ( { 
     proclProcId
    ,proclLog
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateProcessLog = `
        INSERT INTO tbl_process_logs
                (procl_id
                ,procl_proc_id
                ,procl_log
                ,procl_creation_date
                )
        VALUES
                (nextval('tbl_process_logs_procl_id_seq')
                ,$1
                ,$2
                ,NOW()
                )
        RETURNING procl_id`;

        const result = await pool.query(sqlCreateProcessLog, [proclProcId, proclLog]);
        
        const affectedRows = result.rowCount;
        const proclId = result.rows[0]?.procl_id;

        respuesta = {
            type: !affectedRows ? 'error' : 'ok',
            status: 200,
            proclId,
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
         WHERE procl_id = $1
        `;

        const result = await pool.query(sqlDeleteProcess, [proclId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProcessLog = deleteProcessLog;
