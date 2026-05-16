
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const getAllGapsSchedulledLogByGapscdId= async(gapscdId) => {

    let respuesta;
    try {
        const sqlGetAllGapsSchedulledLog = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.gapscl_id ASC) AS id
            ,t1.gapscl_id             AS "gapsclId"     
            ,t1.gapscl_gapscd_id      AS "gapsclGapscdId"  
            ,t1.gapscl_log            AS "gapsclLog"   
            ,t1.gapscl_creation_date  AS "gapsclCreationDate" 
        FROM tbl_gaps_scheduled_logs t1
        WHERE t1.gapscl_gapscd_id = $1
  
        `;

        const result = await pool.query(sqlGetAllGapsSchedulledLog, [gapscdId]);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.rows.length > 0 ? 'Log Programaciones encontradas' : 'No se encontraron Log Programaciones',
            gapsSchedulledLog: result?.rows
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
        INSERT INTO tbl_gaps_scheduled_logs
                (gapsclGapscdId  
                ,gapsclLog   
                ,gapsclCreationDate)
        VALUES
                ($1
                ,$2
                ,NOW()) 
        `;

        const result = await pool.query(sqlCreateGapSchedulledLog, [gapsclGapscdId, gapsclLog]);
        
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
module.exports.createGapSchedulledLog = createGapSchedulledLog;

const updateGapSchedulledLog = async( params, gapscdId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateGapSchedulledLog = `
        UPDATE tbl_gaps_scheduled_logs
           SET ${columnSet}
         WHERE gapscl_id = $1
        `;

        const result = await pool.query(sqlUpdateGapSchedulledLog, [gapsclId]);
        
        return result?.rowCount;
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
         WHERE gapscl_id = $1
        `;

        const result = await pool.query(sqlDeleteGapSchedulledLog, [gapsclId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteGapSchedulledLog = deleteGapSchedulledLog;
