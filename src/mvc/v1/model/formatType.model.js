
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const formatTypeExists = async ( fmtFormatType) => {

    let respuesta;
    try {
        const sqlFormatTypeExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Tipo de Formato Bibliografia ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_format_types t1
                    WHERE t1.fmt_format_type      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlFormatTypeExists, [fmtFormatType]);

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
module.exports.formatTypeExists = formatTypeExists;

const getAllFormatTypes = async() => {

    let respuesta;
    try {
        const sqlGetAllFormatTypes = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.fmt_id ASC) AS id  
            ,t1.fmt_id           AS "fmtId"          
            ,t1.fmt_format		 AS "fmtFormat"
            ,t1.fmt_format_type	 AS "fmtFormatType"
            ,t1.fmt_description	 AS "fmtDescription"
            ,t1.fmt_status		 AS "fmtStatus"
        FROM tbl_format_types t1
        ORDER BY t1.fmt_description
        `;

        const result = await pool.query(sqlGetAllFormatTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Tipo de Formatos encontrados' : 'No se encontraron Tipos de Formatos',
            formatTypes: result?.rows
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
                INSERT INTO tbl_format_types
                        (
                             fmt_format		
                            ,fmt_format_type	
                            ,fmt_description	
                            ,fmt_status		
                        )
                VALUES
                        (
                             $1
                            ,$2
                            ,$3
                            ,$4
                        )
        `;

        const result = await pool.query(sqlCreateFormatType, [fmtFormat, fmtFormatType, fmtDescription, fmtStatus]);
        
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
module.exports.createFormatType = createFormatType;

const updateFormatType = async( params, fmtId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateFormatType= `
        UPDATE tbl_format_types
           SET ${columnSet}
         WHERE fmt_id = $1
        `;

        const result = await pool.query(sqlUpdateFormatType, [fmtId]);
        
        return result?.rowCount;
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
         WHERE fmt_id = $1
        `;

        const result = await pool.query(sqlDeleteFormatType, [fmtId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteFormatType = deleteFormatType;
