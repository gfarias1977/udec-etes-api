const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const volumeTypeExists = async ( vlmCode) => {

    let respuesta;
    try {
        const sqlVolumeTypeExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Tipo de Volumen Bibliografia ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_volume_types t1
                    WHERE t1.vlm_code      =   @vlmCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('vlmCode',  sql.VarChar, vlmCode )
                            .query(sqlVolumeTypeExists);

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
module.exports.volumeTypeExists = volumeTypeExists;

const getAllVolumeTypes = async() => {

    let respuesta;
    try {
        const sqlGetAllvolumeTypes = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.vlm_id ASC) AS id  
            ,t1.vlm_id           AS vlmId          
            ,t1.vlm_code	     AS vlmCode
            ,t1.vlm_description	 AS vlmDescription
            ,t1.vlm_status		 AS vlmStatus
        FROM dbo.tbl_volume_types t1
        ORDER BY t1.vlm_description
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllvolumeTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Tipo de volumeos encontrados' : 'No se encontraron Tipos de volumeos',
            volumeTypes: result?.recordset
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
                INSERT INTO dbo.tbl_volume_types
                        (
                             vlm_code	
                            ,vlm_description	
                            ,vlm_status		
                        )
                VALUES
                        (
                             @vlmCode
                            ,@vlmDescription
                            ,@vlmStatus
                        )
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
        
                            .input('vlmCode',           sql.VarChar,  vlmCode )
                            .input('vlmDescription',    sql.VarChar,  vlmDescription )
                            .input('vlmStatus',         sql.VarChar,  vlmStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateVolumeType);
        
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
module.exports.createVolumeType = createVolumeType;

const updateVolumeType = async( params, vlmId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateVolumeType= `
        UPDATE tbl_volume_types
           SET ${columnSet}
         WHERE vlm_id = @vlmId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('vlmId',     sql.Int, vlmId )
                            .query(sqlUpdateVolumeType);
        
        return result?.rowsAffected[0];
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
         WHERE vlm_id = @vlmId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('vlmId',    sql.Int, vlmId )
                            .query(sqlDeleteVolumeType);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteVolumeType = deleteVolumeType;
