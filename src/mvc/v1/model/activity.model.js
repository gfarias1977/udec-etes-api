const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const activityExists = async ( actCode ) => {

    let respuesta;
    try {
        const sqlActivityExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Actividad ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_activities t1
                    WHERE t1.act_code      =   @actCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('actCode',  sql.VarChar, actCode )
                            .query(sqlActivityExists);

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
module.exports.activityExists = activityExists;

const getAllActivities = async() => {

    let respuesta;
    try {
        const sqlGetAllActivities = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.act_code ASC) AS id 
                ,t1.act_code           AS   actCode
                ,t1.act_name           AS   actName
                ,t1.act_creation_date  AS   actCreationDate
                ,t1.act_status         AS   actStatus
            FROM dbo.tbl_activities t1
            order by  t1.act_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllActivities);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Actividades encontrados' : 'No se encontraron Actividades',
            activities: result?.recordset
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
module.exports.getAllActivities = getAllActivities;


const getActivityById = async( actCode ) => {

    try {
        
        const sqlGetActivityByID = 
        `   SELECT ROW_NUMBER() OVER(ORDER BY  t1.act_code ASC) AS id 
                ,t1.act_code           AS   actCode
                ,t1.act_name           AS   actName
                ,t1.act_creation_date  AS   actCreationDate
                ,t1.act_status         AS   actStatus
            FROM dbo.tbl_activities t1
            WHERE t1.act_code = @actCode
            order by  t1.act_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('actCode', sql.VarChar, actCode )                            
                            .query(sqlGetActivityByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getActivityById = getActivityById;

const getAllActivitiesByName = async(actName) => {

    const qryFindActivitys = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.act_code ASC) AS id 
            ,t1.act_code           AS   actCode
            ,t1.act_name           AS   actName
            ,t1.act_creation_date  AS   actCreationDate
            ,t1.act_status         AS   actStatus
        FROM dbo.tbl_activities t1
        WHERE UPPER(t1.act_name)  LIKE UPPER(CONCAT('%',@actName,'%'))
          AND t1.act_status = 'S'
        order by  t1.act_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('actName', sql.VarChar, actName )
                            .query(qryFindActivitys);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Actividades encontrados' : 'No se encontraron Actividades',
            activities: result?.recordset
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
module.exports.getAllActivitiesByName = getAllActivitiesByName;

const createActivity = async ( { 
    actCode,
    actName, 
    actStatus} ) => {
        
    let respuesta;
    try {
        
        const sqlCreateActivity = `
        INSERT INTO tbl_activities
           (act_code
           ,act_name
           ,act_creation_date
           ,act_status)
        VALUES(
            UPPER(@actCode),
            UPPER(@actName),
            DBO.fncGetDate(),
            UPPER(@actStatus)
        )      
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('actCode',   sql.VarChar,  actCode )                            
                            .input('actName',   sql.VarChar,  actName )
                            .input('actStatus', sql.VarChar,  actStatus )
                            .query(sqlCreateActivity);
        
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
module.exports.createActivity = createActivity;

const updateActivity = async( params, actCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateActivity = `
        UPDATE tbl_activities
           SET ${columnSet}
         WHERE act_code = @actCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('actCode',     sql.VarChar, actCode )
                            .query(sqlUpdateActivity);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateActivity = updateActivity;

const deleteActivity = async ( actCode ) => {
        
    try {
        
        const sqlDeleteActivity = `
        DELETE 
          FROM tbl_activities
         WHERE act_code = @actCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('actCode',     sql.VarChar, actCode )
                            .query(sqlDeleteActivity);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteActivity = deleteActivity;
