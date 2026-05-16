const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const itemAttributeExist = async ( itmaCode, itmaPurcCode ) => {

    let respuesta;
    try {
        const sqlitemAttributExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Atributos de bienes ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_item_attributes t1
                    WHERE t1.itma_code           =   @itmaCode
                    and t1.itma_purc_code      =   @itmaPurcCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmaCode',  sql.VarChar, itmaCode )
                            .input('itmaPurcCode',  sql.VarChar, itmaPurcCode )
                            .query(sqlitemAttributExist);

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
module.exports.itemAttributeExist = itemAttributeExist;

const getAllItemAttributes = async() => {

    let respuesta;
    try {
        const sqlGetAllItemAttributes = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.itma_code ASC) AS id   
            ,t1.itma_code            AS itmaCode
            ,t1.itma_purc_code       AS itmaPurcCode
            ,t2.purc_name            AS itmaPurcName
            ,t1.itma_order           AS itmaOrder
            ,t1.itma_creation_date   AS itmaCreationDate
            ,t1.itma_status          AS itmaStatus
        FROM dbo.tbl_item_attributes t1
            LEFT JOIN dbo.tbl_purchase_areas t2 on t2.purc_code = t1.itma_purc_code
         order by t1.itma_order asc
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllItemAttributes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Atributos de Bienes encontrados' : 'No se encontraron Atributtos de Bienes',
            itemAttributes: result?.recordset
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
module.exports.getAllItemAttributes = getAllItemAttributes;

const getAllItemAttributesByPurcCode = async(itmaPurcCode) => {

    let respuesta;
    try {
        const sqlGetAllItemAttributesByPurcCode = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.itma_code ASC) AS id   
            ,t1.itma_code            AS itmaCode
            ,t1.itma_purc_code       AS itmaPurcCode
            ,t2.purc_name            AS itmaPurcName
            ,t1.itma_order           AS itmaOrder
            ,t1.itma_creation_date   AS itmaCreationDate
            ,t1.itma_status          AS itmaStatus
        FROM dbo.tbl_item_attributes t1
            LEFT JOIN dbo.tbl_purchase_areas t2 on t2.purc_code = t1.itma_purc_code
        WHERE t1.itma_purc_code = @itmaPurcCode
         order by t1.itma_order asc
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmaPurcCode',  sql.VarChar, itmaPurcCode )
                            .query(sqlGetAllItemAttributesByPurcCode);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Atributos de Bienes encontrados' : 'No se encontraron Atributtos de Bienes',
            itemAttributes: result?.recordset
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
module.exports.getAllItemAttributesByPurcCode = getAllItemAttributesByPurcCode;


const getItemAttributeById = async( itmaCode, itmaPurcCode) => {

    try {
        
        const sqlGetItemAttributesByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.itma_code ASC) AS id   
                ,t1.itma_code            AS itmaCode
                ,t1.itma_purc_code       AS itmaPurcCode
                ,t2.purc_name            AS itmaPurcName
                ,t1.itma_order           AS itmaOrder
                ,t1.itma_creation_date   AS itmaCreationDate
                ,t1.itma_status          AS itmaStatus
            FROM dbo.tbl_item_attributes t1
                LEFT JOIN dbo.tbl_purchase_areas t2 on t2.purc_code = t1.itma_purc_code
            WHERE t1.itma_code = @itmaCode
                and  t1.itma_purc_code = @itmaPurcCode
            order by t1.itma_order asc
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmaCode',      sql.VarChar, itmaCode )                            
                            .input('itmaPurcCode',  sql.VarChar, itmaPurcCode )
                            .query(sqlGetItemAttributesByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getItemAttributeById = getItemAttributeById;

const getAllItemAttributesByName = async(itmaCode) => {

    const qryFindItemAttributes = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.itma_code ASC) AS id   
            ,t1.itma_code            AS itmaCode
            ,t1.itma_purc_code       AS itmaPurcCode
            ,t2.purc_name            AS itmaPurcName
            ,t1.itma_order           AS itmaOrder
            ,t1.itma_creation_date   AS itmaCreationDate
            ,t1.itma_status          AS itmaStatus
        FROM dbo.tbl_item_attributes t1
            LEFT JOIN dbo.tbl_purchase_areas t2 on t2.purc_code = t1.itma_purc_code
        WHERE UPPER(t1.itma_code)  LIKE UPPER(CONCAT('%',@itmaCode,'%'))
        order by t1.itma_order asc    
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmaCode', sql.VarChar, itmaCode )
                            .query(qryFindItemAttributes);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Atributtos de Bienes encontradas' : 'No se encontraron Atributtos de Bienes',
            itemAttributes: result?.recordset
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
module.exports.getAllItemAttributesByName = getAllItemAttributesByName;

const createItemAttribute = async ( { 
    itmaCode,
    itmaPurcCode,
    itmaOrder,
    itmaStatus
    }) => {
        
    let respuesta;
    try {
        
        const sqlCreateItemAttribute = `
            INSERT INTO dbo.tbl_item_attributes
                    (itma_code
                    ,itma_purc_code
                    ,itma_order
                    ,itma_creation_date
                    ,itma_status)
            VALUES
                    (@itmaCode
                    ,@itmaPurcCode
                    ,@itmaOrder
                    ,DBO.fncGetDate()
                    ,@itmaStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmaCode',          sql.VarChar,  itmaCode )             
                            .input('itmaPurcCode',      sql.VarChar,  itmaPurcCode )
                            .input('itmaOrder',         sql.Int,      itmaOrder )
                            .input('itmaStatus',        sql.VarChar,  itmaStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateItemAttribute);
        
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
module.exports.createItemAttribute = createItemAttribute;

const updateItemAttribute = async( params, itmaCode,itmaPurcCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateItemAttribute= `
        UPDATE tbl_item_attributes
           SET ${columnSet}
         WHERE itma_code = @itmaCode
         and itma_purc_code = @itmaPurcCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmaCode',         sql.VarChar, itmaCode )
                            .input('itmaPurcCode',     sql.VarChar, itmaPurcCode )
                            .query(sqlUpdateItemAttribute);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateItemAttribute = updateItemAttribute;

const deleteItemAttribute = async ( itmaCode, itmaPurcCode ) => {
        
    try {
        
        const sqlDeleteItemAttribute = `
        DELETE 
          FROM tbl_item_attributes
        WHERE itma_code = @itmaCode
          and itma_purc_code = @itmaPurcCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmaCode',     sql.VarChar, itmaCode )
                            .input('itmaPurcCode',     sql.VarChar, itmaPurcCode )
                            .query(sqlDeleteItemAttribute);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteItemAttribute = deleteItemAttribute;
