
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const activityExists = async ( actCode ) => {

    let respuesta;
    try {
        const sqlActivityExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Actividad ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_activities t1
                    WHERE t1.act_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlActivityExists, [actCode]);

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
module.exports.activityExists = activityExists;

const getAllActivities = async() => {

    let respuesta;
    try {
        const sqlGetAllActivities = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.act_code ASC) AS id 
                ,t1.act_code           AS "actCode"
                ,t1.act_name           AS "actName"
                ,t1.act_creation_date  AS "actCreationDate"
                ,t1.act_status         AS "actStatus"
            FROM tbl_activities t1
            order by  t1.act_code
        `;

        const result = await pool.query(sqlGetAllActivities);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Actividades encontrados' : 'No se encontraron Actividades',
            activities: result?.rows
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
                ,t1.act_code           AS "actCode"
                ,t1.act_name           AS "actName"
                ,t1.act_creation_date  AS "actCreationDate"
                ,t1.act_status         AS "actStatus"
            FROM tbl_activities t1
            WHERE t1.act_code = $1
            order by  t1.act_code
        `;

        const result = await pool.query(sqlGetActivityByID, [actCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getActivityById = getActivityById;

const getAllActivitiesByName = async(actName) => {

    const qryFindActivitys = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.act_code ASC) AS id 
            ,t1.act_code           AS "actCode"
            ,t1.act_name           AS "actName"
            ,t1.act_creation_date  AS "actCreationDate"
            ,t1.act_status         AS "actStatus"
        FROM tbl_activities t1
        WHERE UPPER(t1.act_name)  LIKE UPPER(CONCAT('%',$1,'%'))
          AND t1.act_status = 'S'
        order by  t1.act_code
    `;
    
    try {
        const result = await pool.query(qryFindActivitys, [actName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Actividades encontrados' : 'No se encontraron Actividades',
            activities: result?.rows
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
            UPPER($1),
            UPPER($2),
            NOW(),
            UPPER($3)
        )      
        `;

        const result = await pool.query(sqlCreateActivity, [actCode, actName, actStatus]);
        
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
module.exports.createActivity = createActivity;

const updateActivity = async( params, actCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateActivity = `
        UPDATE tbl_activities
           SET ${columnSet}
         WHERE act_code = $1
        `;

        const result = await pool.query(sqlUpdateActivity, [actCode]);
        
        return result?.rowCount;
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
         WHERE act_code = $1
        `;

        const result = await pool.query(sqlDeleteActivity, [actCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteActivity = deleteActivity;
