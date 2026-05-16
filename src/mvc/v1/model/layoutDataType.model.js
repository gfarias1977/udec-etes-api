const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const layoutDataTypeExist = async ( laydCode ) => {

    let respuesta;
    try {
        const sqlLayoutDataTypeExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Tipo de Layout ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_layout_data_type t1
                    WHERE t1.layd_code      =   @laydCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('laydCode',  sql.VarChar, laydCode )
                            .query(sqlLayoutDataTypeExist);

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
module.exports.layoutDataTypeExist = layoutDataTypeExist;

const getAllLayoutDataTypes = async() => {

    let respuesta;
    try {
        const sqlGetAllLayourDataTypes = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.layd_code ASC) AS id   
                ,t1.layd_code
                ,t1.layd_name
                ,t1.layd_document_type
                ,t1.layd_creation_date
                ,t1.layd_status
            FROM dbo.tbl_layout_data_type t1
            order by t1.layd_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllLayourDataTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Tipos de layout encontrados' : 'No se encontraron Tipos de Layout',
            layoutDataTypes: result?.recordset
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
module.exports.getAllLayoutDataTypes = getAllLayoutDataTypes;


const getLayoutDataTypeById = async( laydCode) => {

    try {
        
        const sqlGetLayoutDataTypeByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.layd_code ASC) AS id   
                ,t1.layd_code
                ,t1.layd_name
                ,t1.layd_document_type
                ,t1.layd_creation_date
                ,t1.layd_status
            FROM dbo.tbl_layout_data_type t1
            WHERE t1.layd_code = @laydCode                 
            order by t1.layd_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('laydCode', sql.VarChar, laydCode )                            
                            .query(sqlGetLayoutDataTypeByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getLayoutDataTypeById = getLayoutDataTypeById;

const getAllLayoutDataTypeByName = async(laydName) => {

    const qryFindLayourDataTypes = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.layd_code ASC) AS id   
            ,t1.layd_code
            ,t1.layd_name
            ,t1.layd_document_type
            ,t1.layd_creation_date
            ,t1.layd_status
        FROM dbo.tbl_layout_data_type t1
        WHERE UPPER(t1.layd_name)  LIKE UPPER(CONCAT('%',@laydName,'%'))
           AND t1.layd_status = 'S'                 
        order by t1.layd_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('laydName', sql.VarChar, laydName )
                            .query(qryFindLayourDataTypes);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Tipos de Layout encontradas' : 'No se encontraron Tipos de Layout',
            layoutDataTypes: result?.recordset
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
module.exports.getAllLayoutDataTypeByName = getAllLayoutDataTypeByName;

const createLayoutDataType = async ( { 
    laydCode,
    laydName,
    laydDocumentType,
    laydStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateLayoutDataType = `
                INSERT INTO dbo.tbl_layout_data_type
                        ( layd_code
                         ,layd_name
                         ,layd_document_type
                         ,layd_creation_date
                         ,layd_status)
                VALUES
                        (@laydCode
                        ,@laydName
                        ,@laydDocumentType
                        ,DBO.fncGetDate()
                        ,@laydStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('laydCode',         sql.VarChar,  laydCode )             
                            .input('laydName',         sql.VarChar,  laydName )
                            .input('laydDocumentType', sql.VarChar,  laydDocumentType )
                            .input('laydStatus',       sql.VarChar,  laydStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateLayoutDataType);
        
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
module.exports.createLayoutDataType = createLayoutDataType;

const updateLayoutDataType = async( params, laydCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateLayoutDataType= `
        UPDATE tbl_layout_data_type
           SET ${columnSet}
         WHERE layd_code = @laydCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('laydCode',     sql.VarChar, laydCode )
                            .query(sqlUpdateLayoutDataType);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateLayoutDataType = updateLayoutDataType;

const deleteLayoutDataType = async ( laydCode ) => {
        
    try {
        
        const sqlDeleteLayoutDataType = `
        DELETE 
          FROM tbl_layout_data_type
         WHERE layd_code = @laydCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('laydCode',     sql.VarChar, laydCode )
                            .query(sqlDeleteLayoutDataType);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteLayoutDataType = deleteLayoutDataType;
