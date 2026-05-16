
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const realStateRoomTypeExist = async (rsrtCode ) => {

    let respuesta;
    try {
        const sqlRealStateRoomTypeExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Recintos Tipo ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_real_state_rooms_type t1
                    WHERE t1.rsrt_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlRealStateRoomTypeExist, [rsrtCode]);

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
            FROM tbl_real_state_rooms_type t1
            order by t1.rsrt_code
        `;

        const result = await pool.query(sqlGetAllRealStateRoomTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Recintos Tipo encontrados' : 'No se encontraron Recintos Tipo',
            realStateRoomTypes: result?.rows
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
            FROM tbl_real_state_rooms_type t1
            WHERE t1.rsrt_code = $1 
            order by t1.rsrt_code
        `;

        const result = await pool.query(sqlGetLevelByID, [rsrtCode]);
        
        return result?.rows[0];
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
        FROM tbl_real_state_rooms_type t1
        WHERE UPPER(t1.rsrt_description)  LIKE UPPER(CONCAT('%',$1,'%'))
        AND t1.rsrt_status = 'S'   
        order by t1.rsrt_code
    `;
    
    try {
        const result = await pool.query(qryFindRealStateRoomTypes, [rsrtDescription]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Recintos Tipo encontradas' : 'No se encontraron Recintos Tipo',
            realStateRoomTypes: result?.rows
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
                INSERT INTO tbl_real_state_rooms_type
                        ( rsrt_code
                         ,rsrt_description
                         ,rsrt_creation_date
                         ,rsrt_status)
                VALUES
                        ($1
                        ,$2
                        ,NOW()
                        ,$3)
        `;

        const result = await pool.query(sqlCreateRealStateRoomType, [rsrtCode, rsrtDescription, rsrtStatus]);
        
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
module.exports.createRealStateRoomType = createRealStateRoomType;

const updateRealStateRoomType = async( params,rsrtCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRealStateRoomType= `
        UPDATE tbl_real_state_rooms_type
           SET ${columnSet}
         WHERE rsrt_code = $1
        `;

        const result = await pool.query(sqlUpdateRealStateRoomType, [rsrtCode]);
        
        return result?.rowCount;
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
         WHERE rsrt_code = $1
        `;

        const result = await pool.query(sqlDeleteRealStateRoomType, [rsrtCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRealStateRoomType = deleteRealStateRoomType;
