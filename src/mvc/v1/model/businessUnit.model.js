const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const businessUnitExists = async ( buCode ) => {

    let respuesta;
    try {
        const sqlBusinessUnitExists = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Unidad de Negocio ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_business_units t1
                   WHERE t1.bu_code      =   @buCode
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('buCode',  sql.VarChar, buCode )
                            .query(sqlBusinessUnitExists);

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
module.exports.businessUnitExists = businessUnitExists;

const getAllBusinessUnits = async() => {

    let respuesta;
    try {
        const sqlGetAllBusinessUnits = `
            SELECT 
                ROW_NUMBER() OVER(ORDER BY  t1.bu_code ASC) AS id
                ,bu_code          AS buCode
                ,bu_name          AS buName
                ,bu_creation_date AS buCreationDate
                ,bu_status        AS buStatus   
            FROM dbo.tbl_business_units t1
            ORDER BY t1.bu_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllBusinessUnits);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Unidades de Negocio encontrados' : 'No se encontraron Unidades de Negocio',
            businessUnits: result?.recordset
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
                ,bu_code           AS buCode
                ,bu_name           AS buName
                ,bu_creation_date  AS buCreationDate
                ,bu_status         AS buStatus 
            FROM dbo.tbl_business_units t1
            WHERE t1.bu_code = @buCode
            ORDER BY t1.bu_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('buCode', sql.VarChar, buCode )                            
                            .query(sqlGetBusinessUnitByID);
        
        return result?.recordset[0];
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
                    ,bu_code            AS buCode
                    ,bu_name            AS buName
                    ,bu_creation_date   AS buCreationDate
                    ,bu_status          AS buStatus  
                FROM dbo.tbl_business_units t1
                WHERE UPPER(t1.bu_name)  LIKE UPPER(CONCAT('%',@buName,'%'))
                    AND t1.bu_status = 'S'
                ORDER BY t1.bu_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('buName', sql.VarChar, buName )
                            .query(qryFindBusinessUnits);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Unidades de Negocio encontrados' : 'No se encontraron Unidades de Negocio',
            businessUnits: result?.recordset
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
            UPPER(@buCode),
            UPPER(@buName),
            DBO.fncGetDate(),
            UPPER(@buStatus)
        )      
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('buCode',   sql.VarChar,  buCode )                            
                            .input('buName',   sql.VarChar,  buName )
                            .input('buStatus', sql.VarChar,  buStatus )
                            .query(sqlCreateBusinessUnit);
        
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
module.exports.createBusinessUnit = createBusinessUnit;

const updateBusinessUnit = async( params, buCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateBusinessUnit = `
        UPDATE tbl_business_units
           SET ${columnSet}
         WHERE bu_code = @buCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('buCode',     sql.VarChar, buCode )
                            .query(sqlUpdateBusinessUnit);
        
        return result?.rowsAffected[0];
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
         WHERE bu_code = @buCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('buCode',     sql.VarChar, buCode )
                            .query(sqlDeleteBusinessUnit);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteBusinessUnit = deleteBusinessUnit;
