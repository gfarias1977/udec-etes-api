const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const getAllGapsSchedulledParamByParam= async(gapscdId, gapsctId ) => {

    let respuesta;
    try {
        const sqlGetAllGapsSchedulledParam = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.gapscp_id ASC) AS id 
            ,t1.gapscp_id             AS gapscpId         
            ,t1.gapscp_gapscd_id	  AS gapscpGapscdId	
            ,t1.gapscp_gapsct_id	  AS gapscpGapsctId	
            ,t1.gapscp_value		  AS gapscpValue		
            ,t1.gapscp_code		      AS gapscpCode		
        FROM tbl_gaps_scheduled_params t1
        WHERE t1.gapscp_gapscd_id	= COALESCE(@gapscpGapscdId, t1.gapscp_gapscd_id)
        AND t1.gapscp_gapsct_id     = COALESCE(gapscpGapsctId,  t1.gapscp_gapsct_id)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('gapscdId',             sql.Numeric,gapscdId) 
                            .input('gapsctId',             sql.Numeric,gapsctId) 
                            .query(sqlGetAllGapsSchedulledParam);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.recordset.length > 0 ? 'Parametros de Programaciones encontradas' : 'No se encontraron Parametros de Programaciones',
            gapsSchedulledParam: result?.recordset
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
        INSERT INTO dbo.tbl_gaps_scheduled_params
            (gapscp_gapscd_id
            ,gapscp_gapsct_id
            ,gapscp_value
            ,gapscp_code)
        VALUES
                (@gapscpGapscdId
                ,@gapscpGapsctId
                ,@gapscpValue
                ,@gapscpCode) 
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('gapscpGapscdId',             sql.Numeric,gapscpGapscdId)         
                            .input('gapscpGapsctId',             sql.Numeric,gapscpGapsctId)         
                            .input('gapscpValue',                sql.VarChar,gapscpValue)       
                            .input('gapscpCode',                 sql.VarChar,gapscpCode)
                            .query(sqlCreateGapSchedulledParam);
        
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
module.exports.createGapSchedulledParam = createGapSchedulledParam;

const updateGapSchedulledParam = async( params, gapscpId ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateGapSchedulledParam = `
        UPDATE dbo.tbl_gaps_scheduled_params
           SET ${columnSet}
         WHERE gapscp_id = @gapscpId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('gapscpId', sql.Numeric, gapscpId )
                            .query(sqlUpdateGapSchedulledParam);
        
        return result?.rowsAffected[0];
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
         WHERE gapscp_id = @gapscpId
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('gapscpId',     sql.Numeric, gapscpId )
                            .query(sqlDeleteGapSchedulledParam);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteGapSchedulledParam = deleteGapSchedulledParam;
