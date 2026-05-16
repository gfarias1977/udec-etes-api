
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const roomLayoutTypeExist = async ( rlatDescription ) => {

    let respuesta;
    try {
        const sqlRoomLayoutTypeExist = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Recintos Tipo ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_rooms_layout_type t1
                   WHERE t1.rlat_description      =   $1
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlRoomLayoutTypeExist, [rlatDescription]);

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
module.exports.roomLayoutTypeExist = roomLayoutTypeExist;

const getAllRoomLayoutTypes = async() => {

    let respuesta;
    try {
        const sqlGetAllRoomLayoutTypes = `
          SELECT 
                 ROW_NUMBER() OVER(ORDER BY  t1.rlat_code ASC) AS id,
                 t1.rlat_code            AS "rlatCode",
                 t1.rlat_description     AS "roleName",
                 t1.rlat_creation_date   AS "roleCreationDate"
           FROM tbl_rooms_layout_type t1
        ORDER BY t1.rlat_code
        `;

        const result = await pool.query(sqlGetAllRoomLayoutTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Recintos Tipo encontrados' : 'No se encontraron Recintos Tipo',
            roomLayoutTypes: result?.rows
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
           WHERE t1.rlat_code = $1
        `;

        const result = await pool.query(sqlGetRomeLayoutTypeByID, [rlatCode]);
        
        return result?.rows[0];
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
     FROM tbl_rooms_layout_type T1
     WHERE UPPER(t1.rlat_description)  LIKE UPPER(CONCAT('%',$1,'%'))
       AND t1.rlat_status = 'S'
    `;
    
    try {
        const result = await pool.query(qryFindRole, [rlatName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Recintos Tipo encontrados' : 'No se encontraron Recintos Tipo',
            roomLayoutTypes: result?.rows
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
            UPPER($1),
            UPPER($2),
            NOW(),
            UPPER($3)
        )      
        `;

        const result = await pool.query(sqlCreateRoomLayoutType, [rlatCode, rlatDescription, rlatStatus]);
        
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
module.exports.createRoomLayoutType = createRoomLayoutType;

const updateRoomLayoutType = async( params, rlatCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRoomLayoutType = `
        UPDATE tbl_rooms_layout_type
           SET ${columnSet}
         WHERE rlat_code = $1
        `;

        const result = await pool.query(sqlUpdateRoomLayoutType, [rlatCode]);
        
        return result?.rowCount;
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
         WHERE rlat_code = $1
        `;

        const result = await pool.query(sqlDeleteRoomLayoutType, [rlatCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRoomLayoutType = deleteRoomLayoutType;
