
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const volumeTypeExists = async ( vlmCode) => {

    let respuesta;
    try {
        const sqlVolumeTypeExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Tipo de Volumen Bibliografia ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_volume_types t1
                    WHERE t1.vlm_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlVolumeTypeExists, [vlmCode]);

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
module.exports.volumeTypeExists = volumeTypeExists;

const getAllVolumeTypes = async() => {

    let respuesta;
    try {
        const sqlGetAllvolumeTypes = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.vlm_id ASC) AS id  
            ,t1.vlm_id           AS "vlmId"          
            ,t1.vlm_code	     AS "vlmCode"
            ,t1.vlm_description	 AS "vlmDescription"
            ,t1.vlm_status		 AS "vlmStatus"
        FROM tbl_volume_types t1
        ORDER BY t1.vlm_description
        `;

        const result = await pool.query(sqlGetAllvolumeTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Tipo de volumeos encontrados' : 'No se encontraron Tipos de volumeos',
            volumeTypes: result?.rows
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
module.exports.getAllVolumeTypes = getAllVolumeTypes;

const createVolumeType = async ( { 
     vlmCode
    ,vlmDescription
    ,vlmStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateVolumeType = `
                INSERT INTO tbl_volume_types
                        (
                             vlm_code	
                            ,vlm_description	
                            ,vlm_status		
                        )
                VALUES
                        (
                             $1
                            ,$2
                            ,$3
                        )
        `;

        const result = await pool.query(sqlCreateVolumeType, [vlmCode, vlmDescription, vlmStatus]);
        
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
module.exports.createVolumeType = createVolumeType;

const updateVolumeType = async( params, vlmId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateVolumeType= `
        UPDATE tbl_volume_types
           SET ${columnSet}
         WHERE vlm_id = $1
        `;

        const result = await pool.query(sqlUpdateVolumeType, [vlmId]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateVolumeType = updateVolumeType;

const deleteVolumeType = async ( vlmId ) => {
        
    try {
        
        const sqlDeleteVolumeType = `
        DELETE 
          FROM tbl_volume_types
         WHERE vlm_id = $1
        `;

        const result = await pool.query(sqlDeleteVolumeType, [vlmId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteVolumeType = deleteVolumeType;
