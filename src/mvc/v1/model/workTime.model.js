
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const workTimeExist = async (wktCode ) => {

    let respuesta;
    try {
        const sqlWorkTimeExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Jornada ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_work_time t1
                    WHERE t1.wkt_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlWorkTimeExist, [wktCode]);

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
module.exports.workTimeExist =workTimeExist;

const getAllWorkTimes = async() => {

    let respuesta;
    try {
        const sqlGetAllWorkTimes = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.wkt_code ASC) AS id   
                ,t1.wkt_code           AS "wktCode"                      
                ,t1.wkt_name           AS "wktName"          
                ,t1.wkt_creation_date  AS "wktCreationDate"         
                ,t1.wkt_status         AS "wktStatus"         
            FROM tbl_work_time t1
            order by t1.wkt_code
        `;

        const result = await pool.query(sqlGetAllWorkTimes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Jornada encontrados' : 'No se encontraron Jornada',
           workTimes: result?.rows
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
module.exports.getAllWorkTimes = getAllWorkTimes;


const getWorkTimeById = async(wktCode) => {

    try {
        
        const sqlGetWorkTimeByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.wkt_code ASC) AS id   
                ,t1.wkt_code           AS "wktCode"                      
                ,t1.wkt_name           AS "wktName"          
                ,t1.wkt_creation_date  AS "wktCreationDate"         
                ,t1.wkt_status         AS "wktStatus"  
            FROM tbl_work_time t1
            WHERE t1.wkt_code = $1 
            order by t1.wkt_code
        `;

        const result = await pool.query(sqlGetWorkTimeByID, [wktCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getWorkTimeById = getWorkTimeById;

const getAllWorkTimeByName = async(wktName) => {

    const qryFindWorkTimes = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.wkt_code ASC) AS id   
            ,t1.wkt_code           AS "wktCode"                      
            ,t1.wkt_name           AS "wktName"          
            ,t1.wkt_creation_date  AS "wktCreationDate"         
            ,t1.wkt_status         AS "wktStatus"  
        FROM tbl_work_time t1
        WHERE UPPER(t1.wkt_name)  LIKE UPPER(CONCAT('%',$1,'%'))
        AND t1.wkt_status = 'S'   
        order by t1.wkt_code
    `;
    
    try {
        const result = await pool.query(qryFindWorkTimes, [wktName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Jornada encontradas' : 'No se encontraron Jornada',
           workTimes: result?.rows
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
module.exports.getAllWorkTimeByName = getAllWorkTimeByName;

const createWorkTime = async ( { 
   wktCode,
   wktName,
   wktStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateWorkTime = `
                INSERT INTO tbl_work_time
                        ( wkt_code
                         ,wkt_name
                         ,wkt_creation_date
                         ,wkt_status)
                VALUES
                        ($1
                        ,$2
                        ,NOW()
                        ,$3)
        `;

        const result = await pool.query(sqlCreateWorkTime, [wktCode, wktName, wktStatus]);
        
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
module.exports.createWorkTime = createWorkTime;

const updateWorkTime = async( params,wktCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateWorkTime= `
        UPDATE tbl_work_time
           SET ${columnSet}
         WHERE wkt_code = $1
        `;

        const result = await pool.query(sqlUpdateWorkTime, [wktCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateWorkTime = updateWorkTime;

const deleteWorkTime = async (wktCode ) => {
        
    try {
        
        const sqlDeleteWorkTime = `
        DELETE 
          FROM tbl_work_time
         WHERE wkt_code = $1
        `;

        const result = await pool.query(sqlDeleteWorkTime, [wktCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteWorkTime = deleteWorkTime;
