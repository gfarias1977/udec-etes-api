
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const purchaseAreaExists = async ( purcCode ) => {

    let respuesta;
    try {
        const sqlPurchaseAreaExists = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Area de compra ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_purchase_areas t1
                   WHERE t1.purc_code     =   $1
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlPurchaseAreaExists, [purcCode]);

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
module.exports.purchaseAreaExists = purchaseAreaExists;

const getAllPurchaseAreas = async() => {

    let respuesta;
    try {
        const sqlGetAllPurchaseAreas = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.purc_code ASC) AS id
                ,t1.purc_code           AS "purcCode"
                ,t1.purc_name           AS "purcName"
                ,t1.purc_description    AS "purcDescription"
                ,t1.purc_creation_date  AS "purcCreationDate"
                ,t1.purc_status         AS "purcStatus"
            FROM tbl_purchase_areas t1
            ORDER BY t1.purc_code
        `;

        const result = await pool.query(sqlGetAllPurchaseAreas);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Areas de compra encontradas' : 'No se encontraron Areas de Compras',
            purchaseAreas: result?.rows
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
                ,t1.purc_code          AS "purcCode"
                ,t1.purc_name          AS "purcName"
                ,t1.purc_description   AS "purcDescription"
                ,t1.purc_creation_date AS "purcCreationDate"
                ,t1.purc_status        AS "purcStatus"
            FROM tbl_purchase_areas t1
            WHERE t1.purc_code = $1
            ORDER BY t1.purc_code
        `;

        const result = await pool.query(sqlGetPurchaseAreaByID, [purcCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getPurchaseAreaById = getPurchaseAreaById;

const getAllPurchaseAreasByName = async(purcName) => {

    const qryFindPurchaseAreas = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.purc_code ASC) AS id
            ,t1.purc_code            AS "purcCode" 
            ,t1.purc_name            AS "purcName"
            ,t1.purc_description     AS "purcDescription"
            ,t1.purc_creation_date   AS "purcCreationDate"
            ,t1.purc_status          AS "purcStatus"
        FROM tbl_purchase_areas t1
        WHERE UPPER(t1.purc_name)  LIKE UPPER(CONCAT('%',$1,'%'))
            AND t1.purc_status = 'S'
        ORDER BY t1.purc_code
    `;
    
    try {
        const result = await pool.query(qryFindPurchaseAreas, [purcName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Areas de Compra encontradas' : 'No se encontraron Areas de Compra',
            purchaseAreas: result?.rows
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
                    ($1
                    ,$2
                    ,$3
                    ,NOW()
                    ,$4)      
        `;

        const result = await pool.query(sqlCreatePurchaseArea, [purcCode, purcName, purcDescription, purcStatus]);
        
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
module.exports.createPurchaseArea = createPurchaseArea;

const updatePurchaseArea = async( params, purcCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdatePurchaseArea = `
        UPDATE tbl_purchase_areas
           SET ${columnSet}
         WHERE purc_code = $1
        `;

        const result = await pool.query(sqlUpdatePurchaseArea, [purcCode]);
        
        return result?.rowCount;
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
         WHERE purc_code = $1
        `;

        const result = await pool.query(sqlDeletePurchaseArea, [purcCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deletePurchaseArea = deletePurchaseArea;
