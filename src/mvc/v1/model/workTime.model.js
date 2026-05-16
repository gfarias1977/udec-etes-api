const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const workTimeExist = async (wktCode ) => {

    let respuesta;
    try {
        const sqlWorkTimeExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Jornada ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_work_time t1
                    WHERE t1.wkt_code      =   @wktCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('wktCode',  sql.VarChar,wktCode )
                            .query(sqlWorkTimeExist);

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
module.exports.workTimeExist =workTimeExist;

const getAllWorkTimes = async() => {

    let respuesta;
    try {
        const sqlGetAllWorkTimes = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.wkt_code ASC) AS id   
                ,t1.wkt_code           AS   wktCode                      
                ,t1.wkt_name           AS   wktName          
                ,t1.wkt_creation_date  AS   wktCreationDate         
                ,t1.wkt_status         AS   wktStatus         
            FROM dbo.tbl_work_time t1
            order by t1.wkt_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllWorkTimes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Jornada encontrados' : 'No se encontraron Jornada',
           workTimes: result?.recordset
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
                ,t1.wkt_code           AS   wktCode                      
                ,t1.wkt_name           AS   wktName          
                ,t1.wkt_creation_date  AS   wktCreationDate         
                ,t1.wkt_status         AS   wktStatus  
            FROM dbo.tbl_work_time t1
            WHERE t1.wkt_code = @wktCode 
            order by t1.wkt_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('wktCode', sql.VarChar,wktCode )                            
                            .query(sqlGetWorkTimeByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getWorkTimeById = getWorkTimeById;

const getAllWorkTimeByName = async(wktName) => {

    const qryFindWorkTimes = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.wkt_code ASC) AS id   
            ,t1.wkt_code           AS   wktCode                      
            ,t1.wkt_name           AS   wktName          
            ,t1.wkt_creation_date  AS   wktCreationDate         
            ,t1.wkt_status         AS   wktStatus  
        FROM dbo.tbl_work_time t1
        WHERE UPPER(t1.wkt_name)  LIKE UPPER(CONCAT('%',@wktName,'%'))
        AND t1.wkt_status = 'S'   
        order by t1.wkt_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('wktName', sql.VarChar,wktName )
                            .query(qryFindWorkTimes);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Jornada encontradas' : 'No se encontraron Jornada',
           workTimes: result?.recordset
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
                INSERT INTO dbo.tbl_work_time
                        ( wkt_code
                         ,wkt_name
                         ,wkt_creation_date
                         ,wkt_status)
                VALUES
                        (@wktCode
                        ,@wktName
                        ,DBO.fncGetDate()
                        ,@wktStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('wktCode',         sql.VarChar, wktCode   )             
                            .input('wktName',         sql.VarChar, wktName   )
                            .input('wktStatus',       sql.VarChar, wktStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateWorkTime);
        
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
module.exports.createWorkTime = createWorkTime;

const updateWorkTime = async( params,wktCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateWorkTime= `
        UPDATE tbl_work_time
           SET ${columnSet}
         WHERE wkt_code = @wktCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('wktCode',     sql.VarChar,wktCode )
                            .query(sqlUpdateWorkTime);
        
        return result?.rowsAffected[0];
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
         WHERE wkt_code = @wktCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('wktCode',     sql.VarChar,wktCode )
                            .query(sqlDeleteWorkTime);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteWorkTime = deleteWorkTime;
