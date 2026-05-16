const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const chargeAccountExists = async ( caccCode, caccOrgCode ) => {

    let respuesta;
    try {
        const sqlChargeAccountExists = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Centro de Costo ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_charge_account t1
                   WHERE t1.cacc_code      =   @caccCode
                   and   t1.cacc_org_code  =   @caccOrgCode
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('caccCode',     sql.VarChar, caccCode )
                            .input('caccOrgCode',  sql.VarChar, caccOrgCode )
                            .query(sqlChargeAccountExists);

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
module.exports.chargeAccountExists = chargeAccountExists;

const getAllChargeAccount = async() => {

    let respuesta;
    try {
        const sqlGetAllChargeAccount = `
            SELECT 
                 ROW_NUMBER() OVER(ORDER BY  t1.cacc_code ASC) AS id
                ,t1.cacc_code           AS caccCode
                ,t1.cacc_org_code       AS caccOrgCode
                ,t1.cacc_description    AS caccDescription
                ,t1.cacc_creation_date  AS caccCreationDate
                ,t1.cacc_status         AS caccStatus
            FROM dbo.tbl_charge_account t1
            order by t1.cacc_code
  
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllChargeAccount);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Centros de Costo encontrados' : 'No se encontraron Centros de Costo',
            chargeAccounts: result?.recordset
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
                    ,t1.cacc_code           AS caccCode
                    ,t1.cacc_org_code       AS caccOrgCode
                    ,t1.cacc_description    AS caccDescription
                    ,t1.cacc_creation_date  AS caccCreationDate
                    ,t1.cacc_status         AS caccStatus
            FROM dbo.tbl_charge_account t1
            WHERE t1.cacc_code     = @caccCode
              and t1.cacc_org_code = @caccOrgCode
            order by t1.cacc_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('caccCode',    sql.VarChar, caccCode )                            
                            .input('caccOrgCode', sql.VarChar, caccOrgCode ) 
                            .query(sqlGetChargeAccountByID);
        
        return result?.recordset[0];
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
             ,t1.cacc_code           AS caccCode
             ,t1.cacc_org_code       AS caccOrgCode
             ,t1.cacc_description    AS caccDescription
             ,t1.cacc_creation_date  AS caccCreationDate
             ,t1.cacc_status         AS caccStatus
        FROM dbo.tbl_charge_account t1
        WHERE UPPER(t1.cacc_description)  LIKE UPPER(CONCAT('%',@caccDescription,'%'))
            AND t1.cacc_status = 'S'
        ORDER BY t1.cacc_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('caccDescription', sql.VarChar, caccDescription )
                            .query(qryFindChargeAccount);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Centros de Costos encontrados' : 'No se encontraron Centros de Costo',
            chargeAccount: result?.recordset
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
                        ,t1.cacc_code           AS caccCode
                        ,t1.cacc_org_code       AS caccOrgCode
                        ,t1.cacc_description    AS caccDescription
                        ,t1.cacc_creation_date  AS caccCreationDate
                        ,t1.cacc_status         AS caccStatus
                    FROM dbo.tbl_charge_account t1
                    JOIN dbo.tbl_users_charge_accounts T2 ON t1.cacc_code = t2.ucac_cacc_code
                    WHERE t1.cacc_org_code = @caccOrgCode
                    and t2.ucac_user_id  = @caccUserId
            ) t0 order by t0.cacc_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('caccOrgCode', sql.VarChar, caccOrgCode )
                            .input('caccUserId',  sql.VarChar, caccUserId )
                            .query(sqlGetAllChargeAccount);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Centros de Costo encontrados' : 'No se encontraron Centros de Costo',
            chargeAccount: result?.recordset
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
                    (UPPER(@caccCode)
                    ,UPPER(@caccOrgCode)
                    ,UPPER(@caccDescription)
                    ,DBO.fncGetDate()
                    ,UPPER(@caccStatus))
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('caccCode',          sql.VarChar,  caccCode )             
                            .input('caccOrgCode',       sql.VarChar,  caccOrgCode )
                            .input('caccDescription',   sql.VarChar,  caccDescription )
                            .input('caccStatus',        sql.VarChar,  caccStatus )
                            .query(sqlCreateChargeAccount);
        
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
module.exports.createChargeAccount = createChargeAccount;

const updateChargeAccount = async( params, caccCode, caccOrgCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateChargeAccount= `
        UPDATE tbl_charge_account
           SET ${columnSet}
         WHERE cacc_code = @caccCode
           and cacc_org_code = @caccOrgCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('caccCode',     sql.VarChar, caccCode )
                            .input('caccOrgCode',  sql.VarChar, caccOrgCode )
                            .query(sqlUpdateChargeAccount);
        
        return result?.rowsAffected[0];
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
         WHERE cacc_code = @caccCode
           and cacc_org_code = @caccOrgCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('caccCode',     sql.VarChar, caccCode )
                            .input('caccOrgCode',  sql.VarChar, caccOrgCode )
                            .query(sqlDeleteChargeAccount);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteChargeAccount = deleteChargeAccount;
