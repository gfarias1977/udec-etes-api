
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const getAllGapsSchedulledParamByParam= async(gapscdId, gapsctId ) => {

    let respuesta;
    try {
        const sqlGetAllGapsSchedulledParam = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.gapscp_id ASC) AS id 
            ,t1.gapscp_id             AS "gapscpId"         
            ,t1.gapscp_gapscd_id	  AS "gapscpGapscdId"	
            ,t1.gapscp_gapsct_id	  AS "gapscpGapsctId"	
            ,t1.gapscp_value		  AS "gapscpValue"		
            ,t1.gapscp_code		      AS "gapscpCode"		
        FROM tbl_gaps_scheduled_params t1
        WHERE t1.gapscp_gapscd_id	= COALESCE(@gapscpGapscdId, t1.gapscp_gapscd_id)
        AND t1.gapscp_gapsct_id     = COALESCE(gapscpGapsctId,  t1.gapscp_gapsct_id)
        `;

        const result = await pool.query(sqlGetAllGapsSchedulledParam, [gapscdId, gapsctId]);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.rows.length > 0 ? 'Parametros de Programaciones encontradas' : 'No se encontraron Parametros de Programaciones',
            gapsSchedulledParam: result?.rows
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
module.exports.getAllGapsSchedulledParamByParam = getAllGapsSchedulledParamByParam;

const createGapSchedulledParam= async ( { 
     gapscpGapscdId	
    ,gapscpGapsctId	
    ,gapscpValue	
    ,gapscpCode		
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateGapSchedulledParam = `
        INSERT INTO tbl_gaps_scheduled_params
            (gapscp_gapscd_id
            ,gapscp_gapsct_id
            ,gapscp_value
            ,gapscp_code)
        VALUES
                ($1
                ,$2
                ,$3
                ,$4) 
        `;

        const result = await pool.query(sqlCreateGapSchedulledParam, [gapscpGapscdId, gapscpGapsctId, gapscpValue, gapscpCode]);
        
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
module.exports.createGapSchedulledParam = createGapSchedulledParam;

const updateGapSchedulledParam = async( params, gapscpId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateGapSchedulledParam = `
        UPDATE tbl_gaps_scheduled_params
           SET ${columnSet}
         WHERE gapscp_id = $1
        `;

        const result = await pool.query(sqlUpdateGapSchedulledParam, [gapscpId]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateGapSchedulledParam = updateGapSchedulledParam;

const deleteGapSchedulledParam = async ( gapscpId) => {
        
    try {
        
        const sqlDeleteGapSchedulledParam= `
        DELETE 
          FROM tbl_gaps_scheduled_params
         WHERE gapscp_id = $1
        `;

        const result = await pool.query(sqlDeleteGapSchedulledParam, [gapscpId]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteGapSchedulledParam = deleteGapSchedulledParam;
