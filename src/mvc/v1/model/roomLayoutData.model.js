
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const roomLayoutDataExist = async (rladLaydCode, rladRlayCode ) => {

    let respuesta;
    try {
        const sqlRoomLayoutDataExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Tipo de Documento del recinto ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_rooms_layout_data t1
                    WHERE t1.rlad_layd_code    =   $1
                    and t1.rlad_rlay_code      =   $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlRoomLayoutDataExist, [rladLaydCode, rladRlayCode]);

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
module.exports.roomLayoutDataExist = roomLayoutDataExist;

const getAllRoomLayoutData = async() => {

    let respuesta;
    try {
        const sqlGetAllRoomLayoutData = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.rlad_layd_code,t1.rlad_rlay_code ASC) AS id 
                ,t1.rlad_id
                ,t1.rlad_layd_code
                ,t1.rlad_rlay_code
                ,t1.rlad_description
                ,t1.rlad_creation_date
                ,t1.rlad_data
            FROM tbl_rooms_layout_data t1
            order by t1.rlad_layd_code,t1.rlad_rlay_code
        `;

        const result = await pool.query(sqlGetAllRoomLayoutData);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Tipo de Documento del recinto encontrados' : 'No se encontraron Tipo de Documento del recinto',
            roomLayoutData: result?.rows
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
module.exports.getAllRoomLayoutData = getAllRoomLayoutData;


const getRoomLayoutDataById = async(rladLaydCode, rladRlayCode) => {

    try {
        
        const sqlGetRoomLayoutDataByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.rlad_layd_code,t1.rlad_rlay_code ASC) AS id 
                ,t1.rlad_id
                ,t1.rlad_layd_code
                ,t1.rlad_rlay_code
                ,t1.rlad_description
                ,t1.rlad_creation_date
                ,t1.rlad_data
            FROM tbl_rooms_layout_data t1
            WHERE t1.rlad_layd_code      =   $1
              and t1.rlad_rlay_code      =   $2
            order by t1.rlad_layd_code,t1.rlad_rlay_code
        `;

        const result = await pool.query(sqlGetRoomLayoutDataByID, [rladLaydCode, rladRlayCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getRoomLayoutDataById = getRoomLayoutDataById;

const getAllRoomLayoutDataByName = async(rladDescription) => {

    const qryFindRoomLayoutData = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY t1.rlad_layd_code,t1.rlad_rlay_code ASC) AS id 
            ,t1.rlad_layd_code
            ,t1.rlad_rlay_code
            ,t1.rlad_creation_date
            ,t1.rlad_data
        FROM tbl_rooms_layout_data t1,
             tbl_layout_data_type  t2,
             tbl_rooms_layout      t3
        WHERE 
            t1.rlad_layd_code = t2.layd_code
        and t1.rlad_rlay_code = t3.rlay_code
        and (UPPER(t2.layd_name)    LIKE UPPER(CONCAT('%',$1,'%')) OR
        UPPER(t3.rlay_description)  LIKE UPPER(CONCAT('%',$1,'%'))) 
        order by t1.rlad_layd_code,t1.rlad_rlay_code
    `;
    
    try {
        const result = await pool.query(qryFindRoomLayoutData, [rladDescription]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Tipo de Documento del recinto encontradas' : 'No se encontraron Tipo de Documento del recinto',
            roomLayoutData: result?.rows
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
module.exports.getAllRoomLayoutDataByName = getAllRoomLayoutDataByName;

const createRoomLayoutData = async ( { 
    rladLaydCode,
    rladRlayCode,
    rladDescription,
    rladData}) => {
        
    let respuesta;
    try {
        
        const sqlCreateRoomLayoutData = `
            INSERT INTO tbl_rooms_layout_data
                    (rlad_layd_code
                    ,rlad_rlay_code
                    ,rlad_description
                    ,rlad_creation_date
                    ,rlad_data)
            VALUES
                    ($1
                    ,$2
                    ,$3
                    ,NOW()
                    ,$4)
        `;

        const result = await pool.query(sqlCreateRoomLayoutData, [rladLaydCode, rladRlayCode, rladDescription, rladData]);
        
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
module.exports.createRoomLayoutData = createRoomLayoutData;

const updateRoomLayoutData = async( params,rladLaydCode, rladRlayCode) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRoomLayoutData= `
        UPDATE tbl_rooms_layout_data
           SET ${columnSet}
        WHERE rlad_layd_code       =   $1
           and rlad_rlay_code      =   $2
        `;

        const result = await pool.query(sqlUpdateRoomLayoutData, [rladLaydCode, rladRlayCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateRoomLayoutData = updateRoomLayoutData;

const deleteRoomLayoutData = async (rladLaydCode, rladRlayCode) => {
        
    try {
        
        const sqlDeleteRoomLayoutData = `
        DELETE 
          FROM tbl_rooms_layout_data
        WHERE rlad_layd_code      =   $1
          and rlad_rlay_code      =   $2
        `;

        const result = await pool.query(sqlDeleteRoomLayoutData, [rladLaydCode, rladRlayCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRoomLayoutData = deleteRoomLayoutData;
