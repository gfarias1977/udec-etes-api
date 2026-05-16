
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const businessUnitExists = async ( buCode ) => {

    let respuesta;
    try {
        const sqlBusinessUnitExists = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Unidad de Negocio ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_business_units t1
                   WHERE t1.bu_code      =   $1
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlBusinessUnitExists, [buCode]);

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
module.exports.businessUnitExists = businessUnitExists;

const getAllBusinessUnits = async() => {

    let respuesta;
    try {
        const sqlGetAllBusinessUnits = `
            SELECT 
                ROW_NUMBER() OVER(ORDER BY  t1.bu_code ASC) AS id
                ,bu_code          AS "buCode"
                ,bu_name          AS "buName"
                ,bu_creation_date AS "buCreationDate"
                ,bu_status        AS "buStatus"   
            FROM tbl_business_units t1
            ORDER BY t1.bu_code
        `;

        const result = await pool.query(sqlGetAllBusinessUnits);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Unidades de Negocio encontrados' : 'No se encontraron Unidades de Negocio',
            businessUnits: result?.rows
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
module.exports.getAllBusinessUnits = getAllBusinessUnits;


const getBusinessUnitById = async( buCode ) => {

    try {
        
        const sqlGetBusinessUnitByID = `
            SELECT 
                ROW_NUMBER() OVER(ORDER BY  t1.bu_code ASC) AS id
                ,bu_code           AS "buCode"
                ,bu_name           AS "buName"
                ,bu_creation_date  AS "buCreationDate"
                ,bu_status         AS "buStatus" 
            FROM tbl_business_units t1
            WHERE t1.bu_code = $1
            ORDER BY t1.bu_code
        `;

        const result = await pool.query(sqlGetBusinessUnitByID, [buCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getBusinessUnitById = getBusinessUnitById;

const getAllBusinessUnitsByName = async(buName) => {

    const qryFindBusinessUnits = 
    `
                SELECT 
                    ROW_NUMBER() OVER(ORDER BY  t1.bu_code ASC) AS id
                    ,bu_code            AS "buCode"
                    ,bu_name            AS "buName"
                    ,bu_creation_date   AS "buCreationDate"
                    ,bu_status          AS "buStatus"  
                FROM tbl_business_units t1
                WHERE UPPER(t1.bu_name)  LIKE UPPER(CONCAT('%',$1,'%'))
                    AND t1.bu_status = 'S'
                ORDER BY t1.bu_code
    `;
    
    try {
        const result = await pool.query(qryFindBusinessUnits, [buName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Unidades de Negocio encontrados' : 'No se encontraron Unidades de Negocio',
            businessUnits: result?.rows
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
module.exports.getAllBusinessUnitsByName = getAllBusinessUnitsByName;

const createBusinessUnit = async ( { 
    buCode,
    buName, 
    buStatus} ) => {
        
    let respuesta;
    try {
        
        const sqlCreateBusinessUnit = `
        INSERT INTO tbl_business_units (
            bu_code,
            bu_name,
            bu_creation_date,
            bu_status
        )VALUES(
            UPPER($1),
            UPPER($2),
            NOW(),
            UPPER($3)
        )      
        `;

        const result = await pool.query(sqlCreateBusinessUnit, [buCode, buName, buStatus]);
        
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
module.exports.createBusinessUnit = createBusinessUnit;

const updateBusinessUnit = async( params, buCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateBusinessUnit = `
        UPDATE tbl_business_units
           SET ${columnSet}
         WHERE bu_code = $1
        `;

        const result = await pool.query(sqlUpdateBusinessUnit, [buCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateBusinessUnit = updateBusinessUnit;

const deleteBusinessUnit = async ( buCode ) => {
        
    try {
        
        const sqlDeleteBusinessUnit = `
        DELETE 
          FROM tbl_business_units
         WHERE bu_code = $1
        `;

        const result = await pool.query(sqlDeleteBusinessUnit, [buCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteBusinessUnit = deleteBusinessUnit;
