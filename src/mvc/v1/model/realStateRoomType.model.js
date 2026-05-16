const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const realStateRoomTypeExist = async (rsrtCode ) => {

    let respuesta;
    try {
        const sqlRealStateRoomTypeExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Recintos Tipo ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_real_state_rooms_type t1
                    WHERE t1.rsrt_code      =   @rsrtCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rsrtCode',  sql.VarChar,rsrtCode )
                            .query(sqlRealStateRoomTypeExist);

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
module.exports.realStateRoomTypeExist = realStateRoomTypeExist;

const getAllRealStateRoomTypes = async() => {

    let respuesta;
    try {
        const sqlGetAllRealStateRoomTypes = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.rsrt_code ASC) AS id   
                ,t1.rsrt_code
                ,t1.rsrt_description
                ,t1.rsrt_creation_date
                ,t1.rsrt_status
            FROM dbo.tbl_real_state_rooms_type t1
            order by t1.rsrt_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllRealStateRoomTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Recintos Tipo encontrados' : 'No se encontraron Recintos Tipo',
            realStateRoomTypes: result?.recordset
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
module.exports.getAllRealStateRoomTypes = getAllRealStateRoomTypes;


const getRealStateRoomTypeById = async(rsrtCode) => {

    try {
        
        const sqlGetLevelByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.rsrt_code ASC) AS id   
                ,t1.rsrt_code
                ,t1.rsrt_description
                ,t1.rsrt_creation_date
                ,t1.rsrt_status
            FROM dbo.tbl_real_state_rooms_type t1
            WHERE t1.rsrt_code = @rsrtCode 
            order by t1.rsrt_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rsrtCode', sql.VarChar,rsrtCode )                            
                            .query(sqlGetLevelByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getRealStateRoomTypeById = getRealStateRoomTypeById;

const getAllProgamTypeByName = async(rsrtDescription) => {

    const qryFindRealStateRoomTypes = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.rsrt_code ASC) AS id   
            ,t1.rsrt_code
            ,t1.rsrt_description
            ,t1.rsrt_creation_date
            ,t1.rsrt_status
        FROM dbo.tbl_real_state_rooms_type t1
        WHERE UPPER(t1.rsrt_description)  LIKE UPPER(CONCAT('%',@rsrtDescription,'%'))
        AND t1.rsrt_status = 'S'   
        order by t1.rsrt_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rsrtDescription', sql.VarChar, rsrtDescription )
                            .query(qryFindRealStateRoomTypes);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Recintos Tipo encontradas' : 'No se encontraron Recintos Tipo',
            realStateRoomTypes: result?.recordset
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
module.exports.getAllProgamTypeByName = getAllProgamTypeByName;

const createRealStateRoomType = async ( { 
    rsrtCode,
    rsrtDescription,
    rsrtStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateRealStateRoomType = `
                INSERT INTO dbo.tbl_real_state_rooms_type
                        ( rsrt_code
                         ,rsrt_description
                         ,rsrt_creation_date
                         ,rsrt_status)
                VALUES
                        (@rsrtCode
                        ,@rsrtDescription
                        ,DBO.fncGetDate()
                        ,@rsrtStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rsrtCode',          sql.VarChar,  rsrtCode        )             
                            .input('rsrtDescription',   sql.VarChar,  rsrtDescription )
                            .input('rsrtStatus',        sql.VarChar,  rsrtStatus      )                                                                                                                                                                                                                                
                            .query(sqlCreateRealStateRoomType);
        
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
module.exports.createRealStateRoomType = createRealStateRoomType;

const updateRealStateRoomType = async( params,rsrtCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRealStateRoomType= `
        UPDATE tbl_real_state_rooms_type
           SET ${columnSet}
         WHERE rsrt_code = @rsrtCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rsrtCode',     sql.VarChar,rsrtCode )
                            .query(sqlUpdateRealStateRoomType);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateRealStateRoomType = updateRealStateRoomType;

const deleteRealStateRoomType = async (rsrtCode) => {
        
    try {
        
        const sqlDeleteRealStateRoomType = `
        DELETE 
          FROM tbl_real_state_rooms_type
         WHERE rsrt_code = @rsrtCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rsrtCode',     sql.VarChar,rsrtCode )
                            .query(sqlDeleteRealStateRoomType);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRealStateRoomType = deleteRealStateRoomType;
