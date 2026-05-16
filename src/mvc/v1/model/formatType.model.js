const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const formatTypeExists = async ( fmtFormatType) => {

    let respuesta;
    try {
        const sqlFormatTypeExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Tipo de Formato Bibliografia ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_format_types t1
                    WHERE t1.fmt_format_type      =   @fmtFormatType
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('fmtFormatType',  sql.VarChar, fmtFormatType )
                            .query(sqlFormatTypeExists);

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
module.exports.formatTypeExists = formatTypeExists;

const getAllFormatTypes = async() => {

    let respuesta;
    try {
        const sqlGetAllFormatTypes = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.fmt_id ASC) AS id  
            ,t1.fmt_id           AS fmtId          
            ,t1.fmt_format		 AS fmtFormat
            ,t1.fmt_format_type	 AS fmtFormatType
            ,t1.fmt_description	 AS fmtDescription
            ,t1.fmt_status		 AS fmtStatus
        FROM dbo.tbl_format_types t1
        ORDER BY t1.fmt_description
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllFormatTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Tipo de Formatos encontrados' : 'No se encontraron Tipos de Formatos',
            formatTypes: result?.recordset
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
module.exports.getAllFormatTypes = getAllFormatTypes;

const createFormatType = async ( { 
     fmtFormat
    ,fmtFormatType
    ,fmtDescription
    ,fmtStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateFormatType = `
                INSERT INTO dbo.tbl_format_types
                        (
                             fmt_format		
                            ,fmt_format_type	
                            ,fmt_description	
                            ,fmt_status		
                        )
                VALUES
                        (
                             @fmtFormat
                            ,@fmtFormatType
                            ,@fmtDescription
                            ,@fmtStatus
                        )
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('fmtFormat',         sql.VarChar,  fmtFormat )             
                            .input('fmtFormatType',     sql.VarChar,  fmtFormatType )
                            .input('fmtDescription',    sql.VarChar,  fmtDescription )
                            .input('fmtStatus',         sql.VarChar,  fmtStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateFormatType);
        
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
module.exports.createFormatType = createFormatType;

const updateFormatType = async( params, fmtId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateFormatType= `
        UPDATE tbl_format_types
           SET ${columnSet}
         WHERE fmt_id = @fmtId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('fmtId',     sql.Int, fmtId )
                            .query(sqlUpdateFormatType);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateFormatType = updateFormatType;

const deleteFormatType = async ( fmtId ) => {
        
    try {
        
        const sqlDeleteFormatType = `
        DELETE 
          FROM tbl_format_types
         WHERE fmt_id = @fmtId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('fmtId',    sql.Int, fmtId )
                            .query(sqlDeleteFormatType);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteFormatType = deleteFormatType;
