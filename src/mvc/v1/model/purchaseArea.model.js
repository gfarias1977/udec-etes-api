const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const purchaseAreaExists = async ( purcCode ) => {

    let respuesta;
    try {
        const sqlPurchaseAreaExists = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Area de compra ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_purchase_areas t1
                   WHERE t1.purc_code     =   @purcCode
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode',  sql.VarChar, purcCode )
                            .query(sqlPurchaseAreaExists);

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
module.exports.purchaseAreaExists = purchaseAreaExists;

const getAllPurchaseAreas = async() => {

    let respuesta;
    try {
        const sqlGetAllPurchaseAreas = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.purc_code ASC) AS id
                ,t1.purc_code           AS purcCode
                ,t1.purc_name           AS purcName
                ,t1.purc_description    AS purcDescription
                ,t1.purc_creation_date  AS purcCreationDate
                ,t1.purc_status         AS purcStatus
            FROM dbo.tbl_purchase_areas t1
            ORDER BY t1.purc_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllPurchaseAreas);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Areas de compra encontradas' : 'No se encontraron Areas de Compras',
            purchaseAreas: result?.recordset
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
module.exports.getAllPurchaseAreas = getAllPurchaseAreas;


const getPurchaseAreaById = async( purcCode ) => {

    try {
        
        const sqlGetPurchaseAreaByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.purc_code ASC) AS id
                ,t1.purc_code          AS purcCode
                ,t1.purc_name          AS purcName
                ,t1.purc_description   AS purcDescription
                ,t1.purc_creation_date AS purcCreationDate
                ,t1.purc_status        AS purcStatus
            FROM dbo.tbl_purchase_areas t1
            WHERE t1.purc_code = @purcCode
            ORDER BY t1.purc_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode', sql.VarChar, purcCode )                            
                            .query(sqlGetPurchaseAreaByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getPurchaseAreaById = getPurchaseAreaById;

const getAllPurchaseAreasByName = async(purcName) => {

    const qryFindPurchaseAreas = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.purc_code ASC) AS id
            ,t1.purc_code            AS purcCode 
            ,t1.purc_name            AS purcName
            ,t1.purc_description     AS purcDescription
            ,t1.purc_creation_date   AS purcCreationDate
            ,t1.purc_status          AS purcStatus
        FROM dbo.tbl_purchase_areas t1
        WHERE UPPER(t1.purc_name)  LIKE UPPER(CONCAT('%',@purcName,'%'))
            AND t1.purc_status = 'S'
        ORDER BY t1.purc_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcName', sql.VarChar, purcName )
                            .query(qryFindPurchaseAreas);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Areas de Compra encontradas' : 'No se encontraron Areas de Compra',
            purchaseAreas: result?.recordset
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
module.exports.getAllPurchaseAreasByName = getAllPurchaseAreasByName;

const createPurchaseArea = async ( { 
    purcCode,
    purcName, 
    purcDescription,
    purcStatus
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreatePurchaseArea = `
            INSERT INTO tbl_purchase_areas
                    (purc_code
                    ,purc_name
                    ,purc_description
                    ,purc_creation_date
                    ,purc_status)
            VALUES
                    (@purcCode
                    ,@purcName
                    ,@purcDescription
                    ,DBO.fncGetDate()
                    ,@purcStatus)      
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode',          sql.VarChar,  purcCode )                            
                            .input('purcName',          sql.VarChar,  purcName )
                            .input('purcDescription',   sql.VarChar,  purcDescription )                            
                            .input('purcStatus',        sql.VarChar,  purcStatus )
                            .query(sqlCreatePurchaseArea);
        
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
module.exports.createPurchaseArea = createPurchaseArea;

const updatePurchaseArea = async( params, purcCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdatePurchaseArea = `
        UPDATE tbl_purchase_areas
           SET ${columnSet}
         WHERE purc_code = @purcCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode', sql.VarChar, purcCode )
                            .query(sqlUpdatePurchaseArea);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updatePurchaseArea = updatePurchaseArea;

const deletePurchaseArea = async ( purcCode ) => {
        
    try {
        
        const sqlDeletePurchaseArea = `
        DELETE 
          FROM tbl_purchase_areas
         WHERE purc_code = @purcCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode',     sql.VarChar, purcCode )
                            .query(sqlDeletePurchaseArea);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deletePurchaseArea = deletePurchaseArea;
