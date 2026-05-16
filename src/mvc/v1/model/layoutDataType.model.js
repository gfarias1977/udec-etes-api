
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const layoutDataTypeExist = async ( laydCode ) => {

    let respuesta;
    try {
        const sqlLayoutDataTypeExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Tipo de Layout ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_layout_data_type t1
                    WHERE t1.layd_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlLayoutDataTypeExist, [laydCode]);

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
            FROM tbl_layout_data_type t1
            order by t1.layd_code
        `;

        const result = await pool.query(sqlGetAllLayourDataTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Tipos de layout encontrados' : 'No se encontraron Tipos de Layout',
            layoutDataTypes: result?.rows
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
            FROM tbl_layout_data_type t1
            WHERE t1.layd_code = $1                 
            order by t1.layd_code
        `;

        const result = await pool.query(sqlGetLayoutDataTypeByID, [laydCode]);
        
        return result?.rows[0];
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
        FROM tbl_layout_data_type t1
        WHERE UPPER(t1.layd_name)  LIKE UPPER(CONCAT('%',$1,'%'))
           AND t1.layd_status = 'S'                 
        order by t1.layd_code
    `;
    
    try {
        const result = await pool.query(qryFindLayourDataTypes, [laydName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Tipos de Layout encontradas' : 'No se encontraron Tipos de Layout',
            layoutDataTypes: result?.rows
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
                INSERT INTO tbl_layout_data_type
                        ( layd_code
                         ,layd_name
                         ,layd_document_type
                         ,layd_creation_date
                         ,layd_status)
                VALUES
                        ($1
                        ,$2
                        ,$3
                        ,NOW()
                        ,$4)
        `;

        const result = await pool.query(sqlCreateLayoutDataType, [laydCode, laydName, laydDocumentType, laydStatus]);
        
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
module.exports.createLayoutDataType = createLayoutDataType;

const updateLayoutDataType = async( params, laydCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateLayoutDataType= `
        UPDATE tbl_layout_data_type
           SET ${columnSet}
         WHERE layd_code = $1
        `;

        const result = await pool.query(sqlUpdateLayoutDataType, [laydCode]);
        
        return result?.rowCount;
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
         WHERE layd_code = $1
        `;

        const result = await pool.query(sqlDeleteLayoutDataType, [laydCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteLayoutDataType = deleteLayoutDataType;
