const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const roomLayoutExist = async ( rlayCode ) => {

    let respuesta;
    try {
        const sqlRoomLayoutExist = `
          SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Recinto Prototipo ya existe.'  AS  validacion,
                         COUNT(*) AS TOTAL
                    FROM tbl_rooms_layout t1
                   WHERE t1.rlay_code     =   @rlayCode
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlayCode',  sql.VarChar, rlayCode )
                            .query(sqlRoomLayoutExist);

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
module.exports.roomLayoutExist = roomLayoutExist;

const getAllRoomLayouts = async() => {

    let respuesta;
    try {
        const sqlGetAllRoomLayouts = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.rlay_code ASC) AS id
                ,t1.rlay_code            AS rlayCode          
                ,t1.rlay_rlat_code       AS rlayRlatCode     
                ,t1.rlay_description     AS rlayDescription   
                ,t1.rlay_capacity        AS rlayCapacity      
                ,t1.rlay_creation_date   AS rlayCreationDate 
                ,'[' + t1.rlay_code  + '] ' + t1.rlay_description + ' [' + t1.rlay_rlat_code + ']' as rlayOptionLabel
                ,t1.rlay_status          AS rlayStatus        
            FROM dbo.tbl_rooms_layout t1
            WHERE t1.rlay_status = 'S'
            ORDER BY t1.rlay_rlat_code desc, t1.rlay_description
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllRoomLayouts);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Recinto Prototipo encontradas' : 'No se encontraron Recinto Prototipos',
            roomLayouts: result?.recordset
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
                ,t1.rlay_code            AS rlayCode          
                ,t1.rlay_rlat_code       AS rlayRlatCode     
                ,t1.rlay_description     AS rlayDescription   
                ,t1.rlay_capacity        AS rlayCapacity      
                ,t1.rlay_creation_date   AS rlayCreationDate 
                ,'[' + t1.rlay_code  + '] ' + t1.rlay_description + ' [' + t1.rlay_rlat_code + ']' as rlayOptionLabel
                ,t1.rlay_status          AS rlayStatus        
            FROM dbo.tbl_rooms_layout t1
            WHERE t1.rlay_status = 'S'
            and t1.rlay_rlat_code  in (select rlaf_rlat_code from dbo.tbl_rooms_layout_filters where rlaf_purc_code = @purcCode)
            ORDER BY t1.rlay_rlat_code desc, t1.rlay_description
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode', sql.VarChar, purcCode )    
                            .query(sqlGetAllRoomLayouts);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Recinto Prototipo encontradas' : 'No se encontraron Recinto Prototipos',
            roomLayouts: result?.recordset
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
                ,t1.rlay_code            AS rlayCode           
                ,t1.rlay_rlat_code       AS rlayRlatCode      
                ,t1.rlay_description     AS rlayDescription    
                ,t1.rlay_capacity        AS rlayCapacity       
                ,t1.rlay_creation_date   AS rlayCreationDate  
                ,t1.rlay_status          AS rlayStatus        
            FROM dbo.tbl_rooms_layout t1
            WHERE t1.rlay_code = @rlayCode
            ORDER BY t1.rlay_rlat_code desc, t1.rlay_description
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlayCode', sql.VarChar, rlayCode )                            
                            .query(sqlGetRoomLayoutByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getRoomLayoutById = getRoomLayoutById;

const getAllRoomLayoutsByName = async(rlayDescription) => {

    const qryFindRoomLayouts = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.rlay_code ASC) AS id
            ,t1.rlay_code            AS rlayCode           
            ,t1.rlay_rlat_code       AS rlayRlatCode     
            ,t1.rlay_description     AS rlayDescription   
            ,t1.rlay_capacity        AS rlayCapacity               
            ,t1.rlay_creation_date   AS rlayCreationDate  
            ,t1.rlay_status          AS rlayStatus        
        FROM dbo.tbl_rooms_layout t1
        WHERE UPPER(t1.rlay_description) LIKE UPPER(CONCAT('%',@rlayDescription,'%'))
            AND t1.rlay_status = 'S'
            ORDER BY t1.rlay_rlat_code desc, t1.rlay_description
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlayDescription', sql.VarChar, rlayDescription )
                            .query(qryFindRoomLayouts);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Recintos Prototipos encontrados' : 'No se encontraron Recintos Prototipos',
            roomLayouts: result?.recordset
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
             t1.rlay_code            AS rlayCode           
            ,t1.rlay_rlat_code       AS rlayRlatCode     
            ,t1.rlay_description     AS rlayDescription   
            ,t1.rlay_capacity        AS rlayCapacity               
            ,t1.rlay_creation_date   AS rlayCreationDate  
            ,t1.rlay_status          AS rlayStatus     
            ,t2.stdc_std_code        AS stdcStdCode   
            ,t2.stdc_org_code        AS stdcOrgCode 
            ,t2.stdc_purc_code       AS stdcPurcCode 
            ,t2.stdc_bu_code         AS stdcBuCode 
        FROM dbo.tbl_rooms_layout t1,
            dbo.tbl_standards_courses t2
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
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('buCode',   sql.VarChar, buCode )
                            .input('orgCode',  sql.VarChar, orgCode )
                            .input('stdCode',  sql.VarChar, stdCode )
                            .input('purcCode', sql.VarChar, purcCode )
                            .query(qryFindRoomLayouts);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Recintos Prototipos encontrados' : 'No se encontraron Recintos Prototipos',
            roomLayouts: result?.recordset
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
                    (@rlayCode
                    ,@rlayRlatCode    
                    ,@rlayDescription
                    ,@rlayCapacity
                    ,DBO.fncGetDate()
                    ,@rlayStatus)      
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlayCode',          sql.VarChar,  rlayCode        )                            
                            .input('rlayRlatCode',      sql.VarChar,  rlayRlatCode    )
                            .input('rlayDescription',   sql.VarChar,  rlayDescription )                            
                            .input('rlayCapacity',      sql.VarChar,  rlayCapacity    )                            
                            .input('rlayStatus',        sql.VarChar,  rlayStatus      )
                            .query(sqlCreateRoomLayout);
        
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
module.exports.createRoomLayout = createRoomLayout;

const updateRoomLayout = async( params, rlayCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateRoomLayout = `
        UPDATE tbl_rooms_layout
           SET ${columnSet}
         WHERE rlay_code = @rlayCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlayCode', sql.VarChar, rlayCode )
                            .query(sqlUpdateRoomLayout);
        
        return result?.rowsAffected[0];
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
         WHERE rlay_code = @rlayCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('rlayCode',     sql.VarChar, rlayCode )
                            .query(sqlDeleteRoomLayout);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteRoomLayout = deleteRoomLayout;
