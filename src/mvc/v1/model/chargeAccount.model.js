
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const chargeAccountExists = async ( caccCode, caccOrgCode ) => {

    let respuesta;
    try {
        const sqlChargeAccountExists = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Centro de Costo ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_charge_account t1
                   WHERE t1.cacc_code      =   $1
                   and   t1.cacc_org_code  =   $2
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlChargeAccountExists, [caccCode, caccOrgCode]);

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
module.exports.chargeAccountExists = chargeAccountExists;

const getAllChargeAccount = async() => {

    let respuesta;
    try {
        const sqlGetAllChargeAccount = `
            SELECT 
                 ROW_NUMBER() OVER(ORDER BY  t1.cacc_code ASC) AS id
                ,t1.cacc_code           AS "caccCode"
                ,t1.cacc_org_code       AS "caccOrgCode"
                ,t1.cacc_description    AS "caccDescription"
                ,t1.cacc_creation_date  AS "caccCreationDate"
                ,t1.cacc_status         AS "caccStatus"
            FROM tbl_charge_account t1
            order by t1.cacc_code
  
        `;

        const result = await pool.query(sqlGetAllChargeAccount);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Centros de Costo encontrados' : 'No se encontraron Centros de Costo',
            chargeAccounts: result?.rows
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
module.exports.getAllChargeAccount = getAllChargeAccount;


const getChargeAccountById = async( caccCode, caccOrgCode) => {

    try {
        
        const sqlGetChargeAccountByID = `
            SELECT 
                    ROW_NUMBER() OVER(ORDER BY  t1.cacc_code ASC) AS id
                    ,t1.cacc_code           AS "caccCode"
                    ,t1.cacc_org_code       AS "caccOrgCode"
                    ,t1.cacc_description    AS "caccDescription"
                    ,t1.cacc_creation_date  AS "caccCreationDate"
                    ,t1.cacc_status         AS "caccStatus"
            FROM tbl_charge_account t1
            WHERE t1.cacc_code     = $1
              and t1.cacc_org_code = $2
            order by t1.cacc_code
        `;

        const result = await pool.query(sqlGetChargeAccountByID, [caccCode, caccOrgCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getChargeAccountById = getChargeAccountById;

const getAllChargeAccountByName = async(caccDescription) => {

    const qryFindChargeAccount = 
    `
        SELECT 
             ROW_NUMBER() OVER(ORDER BY  t1.cacc_code ASC) AS id
             ,t1.cacc_code           AS "caccCode"
             ,t1.cacc_org_code       AS "caccOrgCode"
             ,t1.cacc_description    AS "caccDescription"
             ,t1.cacc_creation_date  AS "caccCreationDate"
             ,t1.cacc_status         AS "caccStatus"
        FROM tbl_charge_account t1
        WHERE UPPER(t1.cacc_description)  LIKE UPPER(CONCAT('%',$1,'%'))
            AND t1.cacc_status = 'S'
        ORDER BY t1.cacc_code
    `;
    
    try {
        const result = await pool.query(qryFindChargeAccount, [caccDescription]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Centros de Costos encontrados' : 'No se encontraron Centros de Costo',
            chargeAccount: result?.rows
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
module.exports.getAllChargeAccountByName = getAllChargeAccountByName;

const getAllChargeAccountByUserId = async(caccUserId, caccOrgCode) => {

    let respuesta;
    try {
        const sqlGetAllChargeAccount = `
            SELECT DISTINCT  ROW_NUMBER() OVER(ORDER BY  t0.cacc_code ASC) AS id, t0.*
            FROM (
                SELECT 
                        ,t1.cacc_code           AS "caccCode"
                        ,t1.cacc_org_code       AS "caccOrgCode"
                        ,t1.cacc_description    AS "caccDescription"
                        ,t1.cacc_creation_date  AS "caccCreationDate"
                        ,t1.cacc_status         AS "caccStatus"
                    FROM tbl_charge_account t1
                    JOIN tbl_users_charge_accounts T2 ON t1.cacc_code = t2.ucac_cacc_code
                    WHERE t1.cacc_org_code = $1
                    and t2.ucac_user_id  = $2
            ) t0 order by t0.cacc_code
        `;

        const result = await pool.query(sqlGetAllChargeAccount, [caccOrgCode, caccUserId]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Centros de Costo encontrados' : 'No se encontraron Centros de Costo',
            chargeAccount: result?.rows
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
module.exports.getAllChargeAccountByUserId = getAllChargeAccountByUserId;

const createChargeAccount = async ( { 
    caccCode,
    caccOrgCode,
    caccDescription,
    caccStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateChargeAccount = `
            INSERT INTO tbl_charge_account
                    (cacc_code
                    ,cacc_org_code
                    ,cacc_description
                    ,cacc_creation_date
                    ,cacc_status)
            VALUES
                    (UPPER($1)
                    ,UPPER($2)
                    ,UPPER($3)
                    ,NOW()
                    ,UPPER($4))
        `;

        const result = await pool.query(sqlCreateChargeAccount, [caccCode, caccOrgCode, caccDescription, caccStatus]);
        
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
module.exports.createChargeAccount = createChargeAccount;

const updateChargeAccount = async( params, caccCode, caccOrgCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateChargeAccount= `
        UPDATE tbl_charge_account
           SET ${columnSet}
         WHERE cacc_code = $1
           and cacc_org_code = $2
        `;

        const result = await pool.query(sqlUpdateChargeAccount, [caccCode, caccOrgCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateChargeAccount = updateChargeAccount;

const deleteChargeAccount = async ( caccCode, caccOrgCode ) => {
        
    try {
        
        const sqlDeleteChargeAccount = `
        DELETE 
          FROM tbl_charge_account
         WHERE cacc_code = $1
           and cacc_org_code = $2
        `;

        const result = await pool.query(sqlDeleteChargeAccount, [caccCode, caccOrgCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteChargeAccount = deleteChargeAccount;
