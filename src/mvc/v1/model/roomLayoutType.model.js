const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const roomLayoutTypeExist = async ( rlatDescription ) => {

    let respuesta;
    try {
        const sqlRoomLayoutTypeExist = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Recintos Tipo ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_rooms_layout_type t1
                   WHERE t1.rlat_description      =   @rlatDescription
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlatDescription',  sql.VarChar, rlatDescription )
                            .query(sqlRoomLayoutTypeExist);

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
module.exports.roomLayoutTypeExist = roomLayoutTypeExist;

const getAllRoomLayoutTypes = async() => {

    let respuesta;
    try {
        const sqlGetAllRoomLayoutTypes = `
          SELECT 
                 ROW_NUMBER() OVER(ORDER BY  t1.rlat_code ASC) AS id,
                 t1.rlat_code            AS  rlatCode,
                 t1.rlat_description     AS  roleName,
                 t1.rlat_creation_date   AS  roleCreationDate
           FROM dbo.tbl_rooms_layout_type t1
        ORDER BY t1.rlat_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllRoomLayoutTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Recintos Tipo encontrados' : 'No se encontraron Recintos Tipo',
            roomLayoutTypes: result?.recordset
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
module.exports.getAllRoomLayoutTypes = getAllRoomLayoutTypes;


const getRoomLayoutTypeById = async( rlatCode ) => {

    try {
        
        const sqlGetRomeLayoutTypeByID = `
          SELECT t1.rlat_code,
                 t1.rlat_description,
                 t1.rlat_creation_date,
                 t1.rlat_status
            FROM tbl_rooms_layout_type t1
           WHERE t1.rlat_code = @rlatCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlatCode', sql.VarChar, rlatCode )                            
                            .query(sqlGetRomeLayoutTypeByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getRoomLayoutTypeById = getRoomLayoutTypeById;

const getAllRoomLayoutTypesByName = async(rlatName) => {

    const qryFindRole = 
    `
    SELECT t1.rlat_code
          ,t1.rlat_description
          ,t1.rlat_creation_date
          ,t1.rlat_status
     FROM dbo.tbl_rooms_layout_type T1
     WHERE UPPER(t1.rlat_description)  LIKE UPPER(CONCAT('%',@rlatName,'%'))
       AND t1.rlat_status = 'S'
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlatName', sql.VarChar, rlatName )
                            .query(qryFindRole);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Recintos Tipo encontrados' : 'No se encontraron Recintos Tipo',
            roomLayoutTypes: result?.recordset
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
module.exports.getAllRoomLayoutTypesByName = getAllRoomLayoutTypesByName;

const createRoomLayoutType = async ( { 
    rlatCode,
    rlatDescription, 
    rlatStatus} ) => {
        
    let respuesta;
    try {
        
        const sqlCreateRoomLayoutType = `
        INSERT INTO tbl_rooms_layout_type (
            rlat_code,
            rlat_description,
            rlat_creation_date,
            rlat_status
        )VALUES(
            UPPER(@rlatCode),
            UPPER(@rlatDescription),
            DBO.fncGetDate(),
            UPPER(@rlatStatus)
        )      
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlatCode',         sql.VarChar,  rlatCode )
                            .input('rlatDescription',  sql.VarChar,  rlatDescription )
                            .input('rlatStatus',       sql.VarChar,  rlatStatus      )
                            .query(sqlCreateRoomLayoutType);
        
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
module.exports.createRoomLayoutType = createRoomLayoutType;

const updateRoomLayoutType = async( params, rlatCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRoomLayoutType = `
        UPDATE tbl_rooms_layout_type
           SET ${columnSet}
         WHERE rlat_code = @rlatCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlatCode',     sql.VarChar, rlatCode )
                            .query(sqlUpdateRoomLayoutType);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateRoomLayoutType = updateRoomLayoutType;

const deleteRoomLayoutType = async ( rlatCode ) => {
        
    try {
        
        const sqlDeleteRoomLayoutType = `
        DELETE 
          FROM tbl_rooms_layout_type
         WHERE rlat_code = @rlatCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlatCode',     sql.VarChar, rlatCode )
                            .query(sqlDeleteRoomLayoutType);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRoomLayoutType = deleteRoomLayoutType;
