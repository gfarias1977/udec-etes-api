
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const userCampusExist = async (usrcUserId, usrcCampCode ) => {

    let respuesta;
    try {
        const sqlUserCampusExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Usuario Sede ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_users_campus t1
                    WHERE t1.usrc_user_id      =   $1
                      and t1.usrc_camp_code    =   $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlUserCampusExist, [usrcUserId, usrcCampCode]);

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
module.exports.userCampusExist = userCampusExist;

const getAllUserCampus = async() => {

    let respuesta;
    try {
        const sqlGetAllUserCampus = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usrc_user_id,t1.usrc_camp_code ASC) AS id 
                ,t1.usrc_user_id
                ,t1.usrc_camp_code
                ,t1.usrc_creation_date
                ,t1.usrc_status
            FROM tbl_users_campus t1
            order by t1.usrc_user_id,t1.usrc_camp_code
        `;

        const result = await pool.query(sqlGetAllUserCampus);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios Sede encontrados' : 'No se encontraron Usuarios-Sede',
            userCampus: result?.rows
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
module.exports.getAllUserCampus = getAllUserCampus;


const getUserCampusById = async(usrcUserId, usrcCampCode) => {

    try {
        
        const sqlGetUserCampusByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usrc_user_id,t1.usrc_camp_code ASC) AS id 
                ,t1.usrc_user_id
                ,t1.usrc_camp_code
                ,t1.usrc_creation_date
                ,t1.usrc_status
            FROM tbl_users_campus t1
            WHERE t1.usrc_user_id      =   $1
            and t1.usrc_camp_code      =   $2
            order by t1.usrc_user_id,t1.usrc_camp_code
        `;

        const result = await pool.query(sqlGetUserCampusByID, [usrcUserId, usrcCampCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserCampusById = getUserCampusById;

const getAllUserCampusByName = async(usrcName) => {

    const qryFindUserCampus = 
    `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usrc_user_id,t1.usrc_camp_code ASC) AS id 
                ,t1.usrc_user_id
                ,t1.usrc_camp_code
                ,t1.usrc_creation_date
                ,t1.usrc_status
            FROM tbl_users_campus t1,
                tbl_user t2,
                tbl_campus t3
            WHERE t1.usrc_user_id       =  t2.user_id  
             and t1.usrc_camp_code      =  t3.camp_code
             and (UPPER(t2.user_first_name)   LIKE UPPER(CONCAT('%',$1,'%')) OR
                  UPPER(t3.camp_description)  LIKE UPPER(CONCAT('%',$1,'%')) ) 
            and t1.usrc_status = 'S' 
            order by t1.usrc_user_id,t1.usrc_camp_code
    `;
    
    try {
        const result = await pool.query(qryFindUserCampus, [usrcName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios Sede encontradas' : 'No se encontraron Usuarios-Sede',
            userCampus: result?.rows
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
module.exports.getAllUserCampusByName = getAllUserCampusByName;

const createUserCampus = async ( { 
    usrcUserId,
    usrcCampCode,
    usrcStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateUserCampus = `
            INSERT INTO tbl_users_campus
                    (usrc_user_id
                    ,usrc_camp_code
                    ,usrc_creation_date
                    ,usrc_status)
            VALUES
                    ($1
                    ,$2
                    ,NOW()
                    ,$3)
        `;

        const result = await pool.query(sqlCreateUserCampus, [usrcUserId, usrcCampCode, usrcStatus]);
        
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
module.exports.createUserCampus = createUserCampus;

const updateUserCampus = async( params,usrcUserId, usrcCampCode) => {
    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateUserCampus= `
        UPDATE tbl_users_campus
           SET ${columnSet}
        WHERE usrc_user_id        =   $1
          and usrc_camp_code      =   $2
        `;

        const result = await pool.query(sqlUpdateUserCampus, [usrcUserId, usrcCampCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUserCampus = updateUserCampus;

const deleteUserCampus = async (usrcUserId, usrcCampCode) => {
        
    try {
        
        const sqlDeleteUserCampus = `
        DELETE 
          FROM tbl_users_campus
        WHERE usrc_user_id        =   $1
          and usrc_camp_code      =   $2
        `;

        const result = await pool.query(sqlDeleteUserCampus, [usrcUserId, usrcCampCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserCampus = deleteUserCampus;
