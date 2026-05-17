
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const roomLayoutExist = async ( rlayCode ) => {

    let respuesta;
    try {
        const sqlRoomLayoutExist = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Recinto Prototipo ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_rooms_layout t1
                   WHERE t1.rlay_code     =   $1
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlRoomLayoutExist, [rlayCode]);

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
module.exports.roomLayoutExist = roomLayoutExist;

const getAllRoomLayouts = async() => {

    let respuesta;
    try {
        const sqlGetAllRoomLayouts = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.rlay_code ASC) AS id
                ,t1.rlay_code            AS "rlayCode"          
                ,t1.rlay_rlat_code       AS "rlayRlatCode"     
                ,t1.rlay_description     AS "rlayDescription"   
                ,t1.rlay_capacity        AS "rlayCapacity"      
                ,t1.rlay_creation_date   AS "rlayCreationDate" 
                ,'[' || t1.rlay_code || '] ' || t1.rlay_description || ' [' || t1.rlay_rlat_code || ']' as rlayOptionLabel
                ,t1.rlay_status          AS "rlayStatus"        
            FROM tbl_rooms_layout t1
            WHERE t1.rlay_status = 'S'
            ORDER BY t1.rlay_rlat_code desc, t1.rlay_description
        `;

        const result = await pool.query(sqlGetAllRoomLayouts);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Recinto Prototipo encontradas' : 'No se encontraron Recinto Prototipos',
            roomLayouts: result?.rows
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
module.exports.getAllRoomLayouts = getAllRoomLayouts;

const getAllRoomLayoutsByPurcCode = async(purcCode) => {

    let respuesta;
    try {
        const sqlGetAllRoomLayouts = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.rlay_code ASC) AS id
                ,t1.rlay_code            AS "rlayCode"          
                ,t1.rlay_rlat_code       AS "rlayRlatCode"     
                ,t1.rlay_description     AS "rlayDescription"   
                ,t1.rlay_capacity        AS "rlayCapacity"      
                ,t1.rlay_creation_date   AS "rlayCreationDate" 
                ,'[' || t1.rlay_code || '] ' || t1.rlay_description || ' [' || t1.rlay_rlat_code || ']' as rlayOptionLabel
                ,t1.rlay_status          AS "rlayStatus"        
            FROM tbl_rooms_layout t1
            WHERE t1.rlay_status = 'S'
            and t1.rlay_rlat_code  in (select rlaf_rlat_code from tbl_rooms_layout_filters where rlaf_purc_code = $1)
            ORDER BY t1.rlay_rlat_code desc, t1.rlay_description
        `;

        const result = await pool.query(sqlGetAllRoomLayouts, [purcCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Recinto Prototipo encontradas' : 'No se encontraron Recinto Prototipos',
            roomLayouts: result?.rows
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
module.exports.getAllRoomLayoutsByPurcCode = getAllRoomLayoutsByPurcCode;


const getRoomLayoutById = async( rlayCode ) => {

    try {
        
        const sqlGetRoomLayoutByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.rlay_code ASC) AS id
                ,t1.rlay_code            AS "rlayCode"           
                ,t1.rlay_rlat_code       AS "rlayRlatCode"      
                ,t1.rlay_description     AS "rlayDescription"    
                ,t1.rlay_capacity        AS "rlayCapacity"       
                ,t1.rlay_creation_date   AS "rlayCreationDate"  
                ,t1.rlay_status          AS "rlayStatus"        
            FROM tbl_rooms_layout t1
            WHERE t1.rlay_code = $1
            ORDER BY t1.rlay_rlat_code desc, t1.rlay_description
        `;

        const result = await pool.query(sqlGetRoomLayoutByID, [rlayCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getRoomLayoutById = getRoomLayoutById;

const getAllRoomLayoutsByName = async(rlayDescription) => {

    const qryFindRoomLayouts = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.rlay_code ASC) AS id
            ,t1.rlay_code            AS "rlayCode"           
            ,t1.rlay_rlat_code       AS "rlayRlatCode"     
            ,t1.rlay_description     AS "rlayDescription"   
            ,t1.rlay_capacity        AS "rlayCapacity"               
            ,t1.rlay_creation_date   AS "rlayCreationDate"  
            ,t1.rlay_status          AS "rlayStatus"        
        FROM tbl_rooms_layout t1
        WHERE UPPER(t1.rlay_description) LIKE UPPER(CONCAT('%',$1,'%'))
            AND t1.rlay_status = 'S'
            ORDER BY t1.rlay_rlat_code desc, t1.rlay_description
    `;
    
    try {
        const result = await pool.query(qryFindRoomLayouts, [rlayDescription]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Recintos Prototipos encontrados' : 'No se encontraron Recintos Prototipos',
            roomLayouts: result?.rows
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
module.exports.getAllRoomLayoutsByName = getAllRoomLayoutsByName;

const getAllRoomLayoutsByParameters = async(purcCode, buCode,stdCode, orgCode) => {

    const qryFindRoomLayouts = 
    `
    SELECT ROW_NUMBER() OVER(ORDER BY  t1.rlayCode ASC) AS id, t1.* FROM (
		SELECT DISTINCT  
             t1.rlay_code            AS "rlayCode"           
            ,t1.rlay_rlat_code       AS "rlayRlatCode"     
            ,t1.rlay_description     AS "rlayDescription"   
            ,t1.rlay_capacity        AS "rlayCapacity"               
            ,t1.rlay_creation_date   AS "rlayCreationDate"  
            ,t1.rlay_status          AS "rlayStatus"     
            ,t2.stdc_std_code        AS "stdcStdCode"   
            ,t2.stdc_org_code        AS "stdcOrgCode" 
            ,t2.stdc_purc_code       AS "stdcPurcCode" 
            ,t2.stdc_bu_code         AS "stdcBuCode" 
        FROM tbl_rooms_layout t1,
            tbl_standards_courses t2
        WHERE 
                t1.rlay_code = t2.stdc_rlay_code
            AND t2.stdc_bu_code   = coalesce(@buCode,t2.stdc_bu_code )
            AND t2.stdc_purc_code = coalesce(@purcCode,t2.stdc_purc_code)
            AND t2.stdc_org_code  = coalesce(@orgCode,t2.stdc_org_code)
            AND t2.stdc_std_code  = coalesce(@stdCode,t2.stdc_std_code)            
            AND t2.stdc_status = 'S') t1
        ORDER BY t1.rlayRlatCode desc, t1.rlayDescription

    `;
    
    try {
        const result = await pool.query(qryFindRoomLayouts, [buCode, orgCode, stdCode, purcCode]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Recintos Prototipos encontrados' : 'No se encontraron Recintos Prototipos',
            roomLayouts: result?.rows
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
module.exports.getAllRoomLayoutsByParameters = getAllRoomLayoutsByParameters;

const createRoomLayout = async ( { 
    rlayCode,
    rlayRlatCode,
    rlayDescription, 
    rlayCapacity,
    rlayStatus
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateRoomLayout = `
            INSERT INTO tbl_rooms_layout
                    (rlay_code
                    ,rlay_rlat_code
                    ,rlay_description
                    ,rlay_capacity
                    ,rlay_creation_date
                    ,rlay_status)
            VALUES
                    ($1
                    ,$2    
                    ,$3
                    ,$4
                    ,NOW()
                    ,$5)      
        `;

        const result = await pool.query(sqlCreateRoomLayout, [rlayCode, rlayRlatCode, rlayDescription, rlayCapacity, rlayStatus]);
        
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
module.exports.createRoomLayout = createRoomLayout;

const updateRoomLayout = async( params, rlayCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRoomLayout = `
        UPDATE tbl_rooms_layout
           SET ${columnSet}
         WHERE rlay_code = $1
        `;

        const result = await pool.query(sqlUpdateRoomLayout, [rlayCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateRoomLayout = updateRoomLayout;

const deleteRoomLayout = async ( rlayCode ) => {
        
    try {
        
        const sqlDeleteRoomLayout = `
        DELETE 
          FROM tbl_rooms_layout
         WHERE rlay_code = $1
        `;

        const result = await pool.query(sqlDeleteRoomLayout, [rlayCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRoomLayout = deleteRoomLayout;
