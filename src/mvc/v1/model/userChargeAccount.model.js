
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const userChargeAccountExist = async (ucacUserId, ucacPurcCode,ucacCaccCode  ) => {

    let respuesta;
    try {
        const sqlUserChargeAccountExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Usuario Centro de costo ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_users_charge_accounts t1
                    WHERE t1.ucac_user_id      =   $1
                    and t1.ucac_purc_code      =   $2
                    and t1.ucac_cacc_code      =   $3
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlUserChargeAccountExist, [ucacUserId, ucacPurcCode, ucacCaccCode]);

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
module.exports.userChargeAccountExist =userChargeAccountExist;

const getAllUserChargeAccounts = async() => {

    let respuesta;
    try {
        const sqlGetAllUserChargeAccounts = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code ASC) AS id 
                ,t1.ucac_user_id
                ,t1.ucac_purc_code
                ,t1.ucac_cacc_code
                ,t1.ucac_creation_date
                ,t1.ucac_status
            FROM tbl_users_charge_accounts t1
            order by t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code
        `;

        const result = await pool.query(sqlGetAllUserChargeAccounts);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios-Area de Compra-Centro de Costo encontrados' : 'No se encontraron Usuarios-Area de compra-Centro de Costo',
            userChargeAccounts: result?.rows
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
module.exports.getAllUserChargeAccounts = getAllUserChargeAccounts;


const getUserChargeAccountById = async(ucacUserId, ucacPurcCode,ucacCaccCode) => {

    try {
        
        const sqlGetUserChargeAccountByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code ASC) AS id 
                ,t1.ucac_user_id
                ,t1.ucac_purc_code
                ,t1.ucac_cacc_code
                ,t1.ucac_creation_date
                ,t1.ucac_status
            FROM tbl_users_charge_accounts t1
            WHERE t1.ucac_user_id        =   $1
              and t1.ucac_purc_code      =   $2
              and t1.ucac_cacc_code      =   $3            
            order by t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code
        `;

        const result = await pool.query(sqlGetUserChargeAccountByID, [ucacUserId, ucacPurcCode, ucacCaccCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getUserChargeAccountById = getUserChargeAccountById;

const getAllUserChargeAccountByName = async(ucacName) => {

    const qryFindUserChargeAccounts = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code ASC) AS id 
            ,t1.ucac_user_id
            ,t1.ucac_purc_code
            ,t1.ucac_cacc_code
            ,t1.ucac_creation_date
            ,t1.ucac_status
        FROM tbl_users_charge_accounts t1,
            tbl_user t2,
            tbl_charge_account t3,
            tbl_purchase_areas t4
        WHERE 
            t1.ucac_user_id =  t2.user_id
        and t1.ucac_cacc_code = t3.cacc_code
        and t1.ucac_purc_code = t4.purc_code
        and (UPPER(t2.user_first_name)  LIKE UPPER(CONCAT('%',$1,'%')) OR
        UPPER(t3.cacc_description)  LIKE UPPER(CONCAT('%',$1,'%')) OR
        UPPER(t4.purc_name)  LIKE UPPER(CONCAT('%',$1,'%'))) 
        AND t1.ucac_status = 'S'            
        order by t1.ucac_user_id,t1.ucac_purc_code,t1.ucac_cacc_code
    `;
    
    try {
        const result = await pool.query(qryFindUserChargeAccounts, [ucacName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Usuarios-Area de Compra-Centro de Costo encontradas' : 'No se encontraron Usuarios-Area de Compra-Centro de Costo',
            userChargeAccounts: result?.rows
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
module.exports.getAllUserChargeAccountByName = getAllUserChargeAccountByName;

const createUserChargeAccount = async ( { 
    ucacUserId,
    ucacPurcCode,
    ucacCaccCode,
    ucacStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateUserChargeAccount = `
            INSERT INTO tbl_users_charge_accounts
                    (ucac_user_id
                    ,ucac_purc_code
                    ,ucac_cacc_code
                    ,ucac_creation_date
                    ,ucac_status)
            VALUES
                    ($1
                    ,$2
                    ,$3
                    ,NOW()
                    ,$4)
        `;

        const result = await pool.query(sqlCreateUserChargeAccount, [ucacUserId, ucacPurcCode, ucacCaccCode, ucacStatus]);
        
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
module.exports.createUserChargeAccount = createUserChargeAccount;

const updateUserChargeAccount = async( params,ucacUserId, ucacPurcCode,ucacCaccCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateUserChargeAccount= `
        UPDATE tbl_users_charge_accounts
           SET ${columnSet}
        WHERE ucac_user_id         =   $1
           and ucac_purc_code      =   $2
           and ucac_cacc_code      =   $3   
        `;

        const result = await pool.query(sqlUpdateUserChargeAccount, [ucacUserId, ucacPurcCode, ucacCaccCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateUserChargeAccount = updateUserChargeAccount;

const deleteUserChargeAccount = async (ucacUserId, ucacPurcCode,ucacCaccCode ) => {
        
    try {
        
        const sqlDeleteUserChargeAccount = `
        DELETE 
          FROM tbl_users_charge_accounts
        WHERE ucac_user_id         =   $1
          and ucac_purc_code      =   $2
          and ucac_cacc_code      =   $3  
        `;

        const result = await pool.query(sqlDeleteUserChargeAccount, [ucacUserId, ucacPurcCode, ucacCaccCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteUserChargeAccount = deleteUserChargeAccount;
