
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const UserBusinessUnitExist = async (usbuUserId, usbuBuCode ) => {

    let respuesta;
    try {
        const sqlUserBusinessUnitExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Usuario Unidad de Negocio ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_users_business_units t1
                    WHERE t1.usbu_user_id    =   $1
                      and t1.usbu_bu_code    =   $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlUserBusinessUnitExist, [usbuUserId, usbuBuCode]);

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
module.exports.UserBusinessUnitExist = UserBusinessUnitExist;

const getAllUserBusinessUnits = async() => {

    let respuesta;
    try {
        const sqlGetAllUserBusinessUnit = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usbu_user_id,t1.usbu_bu_code ASC) AS id 
                ,t1.usbu_user_id            AS "usbuUserId"
                ,t1.usbu_bu_code            AS "usbuBuCode"
                ,t2.bu_name                 AS "usbuBuName"                
                ,t1.usbu_creation_date      AS "usbuBuCreationDate"
                ,t1.usbu_status             AS "usbuBuStatus"
            FROM tbl_users_business_units t1,
                 tbl_business_units t2
            WHERE t1.usbu_bu_code = t2.bu_code 
            order by t2.bu_name
        `;

        const result = await pool.query(sqlGetAllUserBusinessUnit);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios Unidad de Negocio encontrados' : 'No se encontraron Usuarios-Unidad de Negocio',
            userBusinessUnits: result?.rows
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
module.exports.getAllUserBusinessUnits = getAllUserBusinessUnits


const getUserBusinessUnitById = async(usbuUserId, usbuBuCode) => {

    try {
        
        const sqlGetUserBusinessUnitByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usbu_user_id,t1.usbu_bu_code ASC) AS id 
                ,t1.usbu_user_id            AS "usbuUserId"
                ,t1.usbu_bu_code            AS "usbuBuCode"
                ,t2.bu_name                 AS "usbuBuName"                
                ,t1.usbu_creation_date      AS "usbuBuCreationDate"
                ,t1.usbu_status             AS "usbuBuStatus"
            FROM tbl_users_business_units t1,
                 tbl_business_units t2
            WHERE t1.usbu_bu_code    = t2.bu_code 
                and t1.usbu_user_id  =   $1
                and t1.usbu_bu_code  =   $2
            order by t2.bu_name
        `;

        const result = await pool.query(sqlGetUserBusinessUnitByID, [usbuUserId, usbuBuCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserBusinessUnitById = getUserBusinessUnitById;

const getAllBusinessUnitsByUserId = async(usbuUserId) => {

    try {
        
        const sqlGetUserBusinessUnitsByUserID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t2.usbu_user_id,t2.usbu_bu_code ASC) AS id 
                ,coalesce(t2.usbu_user_id,$1)   AS "usbuUserId"  
                ,t1.bu_code                              AS "usbuBuCode"
                ,t1.bu_name                              AS "usbuBuName"                
                ,t2.usbu_creation_date                   AS "usbuBuCreationDate"
                ,coalesce(t2.usbu_status, 'N')           AS "usbuBuAsigned"
                ,coalesce(t2.usbu_status, t1.bu_status)  AS "usbuBuStatus"
            FROM  tbl_business_units t1
                left join  tbl_users_business_units t2 on t2.usbu_bu_code = t1.bu_code  
            and t2.usbu_user_id    =  $1
            order by t1.bu_name, coalesce(t2.usbu_status, 'N')
        `;

        const result = await pool.query(sqlGetUserBusinessUnitsByUserID, [usbuUserId]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuario Unidades de Negocio encontrados' : 'No se encontraron Usuario Unidades de Negocio',
            userBusinessUnits: result?.rows
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

module.exports.getAllBusinessUnitsByUserId = getAllBusinessUnitsByUserId;

const getUserBusinessUnitByUserName = async(usbuUserName, usbuBuCode) => {

    try {
        
        const sqlGetUserBusinessUnitByUserName = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usbu_user_id,t1.usbu_bu_code ASC) AS id 
                ,t1.usbu_user_id            AS "usbuUserId"
                ,t1.usbu_bu_code            AS "usbuBuCode"
                ,t3.bu_name                 AS "usbuBuName" 
                ,t1.usbu_creation_date      AS "usbuBuCreationDate"
                ,t1.usbu_status             AS "usbuBuStatus"
            FROM tbl_users_business_units t1,
                 tbl_user t2,
                 tbl_business_units t3
            WHERE t1.usbu_bu_code   =   t3.bu_code 
              and t1.usbu_user_id   =   t2.user_id
              and t2.user_name      =   $1
              and t1.usbu_bu_code   =   $2
            order by t3.bu_name
        `;

        const result = await pool.query(sqlGetUserBusinessUnitByUserName, [usbuUserName, usbuBuCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserBusinessUnitByUserName = getUserBusinessUnitByUserName;

const getAllUserBusinessUnitByName = async(usbuName) => {

    const qryFindUserBusinessUnit = 
    `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.usbu_user_id,t1.usbu_bu_code ASC) AS id 
                ,t1.usbu_user_id            AS "usbuUserId"
                ,t1.usbu_bu_code            AS "usbuBuCode"
                ,t3.bu_name                 AS "usbuBuName"                
                ,t1.usbu_creation_date      AS "usbuBuCreationDate"
                ,t1.usbu_status             AS "usbuBuStatus"
            FROM tbl_users_business_units t1,
                tbl_user t2,
                tbl_business_units t3
            WHERE t1.usbu_user_id      =  t2.user_id  
              and t1.usbu_bu_code      =  t3.bu_code
              and (UPPER(t2.user_first_name)   LIKE UPPER(CONCAT('%',$1,'%')) OR
                   UPPER(t3.bu_name)           LIKE UPPER(CONCAT('%',$1,'%')) ) 
            and t1.usbu_status = 'S' 
            order by t3.bu_name
    `;
    
    try {
        const result = await pool.query(qryFindUserBusinessUnit, [usbuName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios Unidad de Negocio encontradas' : 'No se encontraron Usuarios-Unidad de Negocio',
            userBusinessUnits: result?.rows
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
module.exports.getAllUserBusinessUnitByName = getAllUserBusinessUnitByName;

const createUserBusinessUnit = async ( { 
    usbuUserId,
    usbuBuCode,
    usbuStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateUserBusinessUnit = `
            INSERT INTO tbl_users_business_units
                    (usbu_user_id
                    ,usbu_bu_code
                    ,usbu_creation_date
                    ,usbu_status)
            VALUES
                    ($1
                    ,$2
                    ,NOW()
                    ,$3)
        `;

        const result = await pool.query(sqlCreateUserBusinessUnit, [usbuUserId, usbuBuCode, usbuStatus]);
        
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
module.exports.createUserBusinessUnit = createUserBusinessUnit;

const updateUserBusinessUnit = async( params,usbuUserId, usbuBuCode) => {
    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateUserBusinessUnit= `
        UPDATE tbl_users_business_units
           SET ${columnSet}
        WHERE usbu_user_id      =   $1
          and usbu_bu_code      =   $2
        `;

        const result = await pool.query(sqlUpdateUserBusinessUnit, [usbuUserId, usbuBuCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUserBusinessUnit = updateUserBusinessUnit;

const deleteUserBusinessUnit = async (usbuUserId, usbuBuCode) => {
        
    try {
        
        const sqlDeleteUserBusinessUnit = `
        DELETE 
          FROM tbl_users_business_units
        WHERE usbu_user_id      =   $1
          and usbu_bu_code      =   $2
        `;

        const result = await pool.query(sqlDeleteUserBusinessUnit, [usbuUserId, usbuBuCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserBusinessUnit = deleteUserBusinessUnit;

const deleteUserBusinessUnitsByUserId = async (usbuUserId) => {
        
    try {
        
        const sqlDeleteUserBusinessUnits = `
        DELETE 
          FROM tbl_users_business_units
        WHERE usbu_user_id   =   $1
        `;

        const result = await pool.query(sqlDeleteUserBusinessUnits, [usbuUserId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserBusinessUnitsByUserId = deleteUserBusinessUnitsByUserId;
