
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const UserPurchaseAreaExist = async (uspaUserId, uspaPurcCode ) => {

    let respuesta;
    try {
        const sqlUserPurchaseAreaExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Usuario Area de Compra ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_users_purchase_areas t1
                    WHERE t1.uspa_user_id      =   $1
                    and t1.uspa_purc_code      =   $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlUserPurchaseAreaExist, [uspaUserId, uspaPurcCode]);

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
module.exports.UserPurchaseAreaExist =UserPurchaseAreaExist;

const getAllUserPurchaseAreas = async() => {

    let respuesta;
    try {
        const sqlGetAllUserPurchaseAreas = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.uspa_user_id,t1.uspa_purc_code ASC) AS id 
                ,t1.uspa_user_id        AS "uspaUserId"
                ,t1.uspa_purc_code      AS "uspaPurcCode"
                ,t2.purc_name           AS "uspaPurcName"
                ,t1.uspa_creation_date  AS "uspaCreationdate"
                ,t1.uspa_status         AS "uspaStatus"
            FROM tbl_users_purchase_areas t1,
                 tbl_purchase_areas t2
            WHERE t1.uspa_purc_code = t2.purc_code
            order by t2.purc_name
        `;

        const result = await pool.query(sqlGetAllUserPurchaseAreas);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios Area de Compra encontrados' : 'No se encontraron Usuarios Area de Compra',
            userPurchaseAreas: result?.rows
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
module.exports.getAllUserPurchaseAreas = getAllUserPurchaseAreas;


const getUserPurchaseAreaById = async(uspaUserId, uspaPurcCode) => {

    try {
        
        const sqlGetUserPurchaseAreaByID = `
        SELECT ROW_NUMBER() OVER(ORDER BY t1.uspa_user_id,t1.uspa_purc_code ASC) AS id 
                ,t1.uspa_user_id        AS "uspaUserId"
                ,t1.uspa_purc_code      AS "uspaPurcCode"
                ,t2.purc_name           AS "uspaPurcName"
                ,t1.uspa_creation_date  AS "uspaCreationdate"
                ,t1.uspa_status         AS "uspaStatus"
            FROM tbl_users_purchase_areas t1,
                tbl_purchase_areas t2
            WHERE t1.uspa_purc_code = t2.purc_code
              and t1.uspa_user_id        =   $1
              and t1.uspa_purc_code      =   $2
            order by t2.purc_name
        `;

        const result = await pool.query(sqlGetUserPurchaseAreaByID, [uspaUserId, uspaPurcCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserPurchaseAreaById = getUserPurchaseAreaById;

const getUserPurchaseAreasByUserId = async(uspaUserId) => {

    try {
        
        const sqlGetUserPurchaseAreaByUserID = `
        SELECT ROW_NUMBER() OVER(ORDER BY t2.uspa_user_id,t2.uspa_purc_code ASC) AS id 
                ,coalesce(t2.uspa_user_id,$1) as uspaUserId  
                ,t1.purc_code                  AS "uspaPurcCode"
                ,t1.purc_name                  AS "uspaPurcName"
                ,t2.uspa_creation_date         AS "uspaCreationDate"
                ,coalesce(t2.uspa_status, 'N') AS "uspaAsigned"
                ,coalesce(t2.uspa_status, t1.purc_status)               AS "uspaStatus"
            FROM tbl_purchase_areas t1
                left join  tbl_users_purchase_areas t2 on t2.uspa_purc_code = t1.purc_code  
            and t2.uspa_user_id    =  $1
            order by t1.purc_name, coalesce(t2.uspa_status, 'N')
        `;

        const result = await pool.query(sqlGetUserPurchaseAreaByUserID, [uspaUserId]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuario Areas de Gestión encontrados' : 'No se encontraron Usuario Areas de Gestión',
            userPurchaseAreas: result?.rows
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


module.exports.getUserPurchaseAreasByUserId = getUserPurchaseAreasByUserId;

const getUserPurchaseAreaByUserName = async(uspaUserName, uspaPurcCode) => {

    try {
        
        const sqlGetUserPurchaseAreaByUserName = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.uspa_user_id,t1.uspa_purc_code ASC) AS id 
                ,t1.uspa_user_id        AS "uspaUserId"
                ,t1.uspa_purc_code      AS "uspaPurcCode"
                ,t2.purc_name           AS "uspaPurcName"
                ,t1.uspa_creation_date  AS "uspaCreationDate"
                ,t1.uspa_status         AS "uspaStatus"
            FROM tbl_users_purchase_areas t1,
                tbl_purchase_areas t2,
                tbl_user t3
            WHERE t1.uspa_purc_code     = t2.purc_code
            and t1.uspa_user_id        =   t3.user_id
            and t1.uspa_purc_code      =   $2
            and t3.user_name           =   $1
            order by t2.purc_name
        `;

        const result = await pool.query(sqlGetUserPurchaseAreaByUserName, [uspaUserName, uspaPurcCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserPurchaseAreaByUserName = getUserPurchaseAreaByUserName;

const getAllUserPurchaseAreaByName = async(uspaName) => {

    const qryFindUserPurchaseAreas = 
    `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.uspa_user_id,t1.uspa_purc_code ASC) AS id 
                ,t1.uspa_user_id        AS "uspauserId"
                ,t1.uspa_purc_code      AS "uspaPurcCode"
                ,t3.purc_name           AS "uspaPurcName"
                ,t1.uspa_creation_date  AS "uspaCreationDate"
                ,t1.uspa_status         AS "uspaStatus"
            FROM tbl_users_purchase_areas t1,
                tbl_user t2,
                tbl_purchase_areas t3
            WHERE 
                t1.uspa_user_id =  t2.user_id
            and t1.uspa_purc_code = t3.purc_code
            and (UPPER(t2.user_first_name)  LIKE UPPER(CONCAT('%',$1,'%')) OR
            UPPER(t3.purc_name)  LIKE UPPER(CONCAT('%',$1,'%'))) 
            AND t1.uspa_status = 'S'            
            order by t3.purc_name
    `;
    
    try {
        const result = await pool.query(qryFindUserPurchaseAreas, [uspaName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios Area de Compra encontradas' : 'No se encontraron Usuarios Area de Compra',
            userPurchaseAreas: result?.rows
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
module.exports.getAllUserPurchaseAreaByName = getAllUserPurchaseAreaByName;

const createUserPurchaseArea = async ( { 
    uspaUserId,
    uspaPurcCode,
    uspaStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateUserPurchaseArea = `
            INSERT INTO tbl_users_purchase_areas
                    (uspa_user_id
                    ,uspa_purc_code
                    ,uspa_creation_date
                    ,uspa_status)
            VALUES
                    ($1
                    ,$2
                    ,NOW()
                    ,$3)
        `;

        const result = await pool.query(sqlCreateUserPurchaseArea, [uspaUserId, uspaPurcCode, uspaStatus]);
        
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
module.exports.createUserPurchaseArea = createUserPurchaseArea;


const updateUserPurchaseArea = async( params,uspaUserId, uspaPurcCode) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateUserPurchaseArea= `
        UPDATE tbl_users_purchase_areas
           SET ${columnSet}
        WHERE uspa_user_id         =   $1
           and uspa_purc_code      =   $2
        `;

        const result = await pool.query(sqlUpdateUserPurchaseArea, [uspaUserId, uspaPurcCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUserPurchaseArea = updateUserPurchaseArea;

const deleteUserPurchaseArea = async (uspaUserId, uspaPurcCode) => {
        
    try {
        
        const sqlDeleteUserPurchaseArea = `
        DELETE 
          FROM tbl_users_purchase_areas
        WHERE uspa_user_id         =   $1
          and uspa_purc_code      =   $2
        `;

        const result = await pool.query(sqlDeleteUserPurchaseArea, [uspaUserId, uspaPurcCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserPurchaseArea = deleteUserPurchaseArea;

const deleteUserPurchaseAreaByUserId = async (uspaUserId) => {
        
    try {
        
        const sqlDeleteUserPurchaseArea = `
        DELETE 
          FROM tbl_users_purchase_areas
        WHERE uspa_user_id         =   $1
        `;

        const result = await pool.query(sqlDeleteUserPurchaseArea, [uspaUserId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserPurchaseAreaByUserId = deleteUserPurchaseAreaByUserId;

