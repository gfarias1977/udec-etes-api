const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const itemCategoryExist = async ( itmcName, itmcPurcCode ) => {

    let respuesta;
    try {
        const sqlItemCategoryExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Categorias de bienes ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_item_categories t1
                    WHERE t1.itmc_Name         =   @itmcName
                    and t1.itmc_purc_code      =   @itmcPurcCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmcName',      sql.VarChar, itmcName )
                            .input('itmcPurcCode',  sql.VarChar, itmcPurcCode )
                            .query(sqlItemCategoryExist);

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
module.exports.itemCategoryExist = itemCategoryExist;

const getAllItemCategories = async() => {

    let respuesta;
    try {
        const sqlGetAllItemCategories = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.itmc_code ASC) AS id   
                ,t1.itmc_code           AS itmcCode         
                ,t1.itmc_purc_code      AS itmcPurcCode    
                ,t2.purc_name           AS purcName         
                ,t1.itmc_name           AS itmcName         
                ,t1.itmc_description    AS itmcDescription  
                ,t1.itmc_order          AS itmcOrder        
                ,t1.itmc_parent_code    AS itmcParentCode  
                ,t1.itmc_creation_date  AS itmcCreationDate
                ,t1.itmc_status         AS itmcStatus  
            FROM dbo.tbl_item_categories t1
            order by t1.itmc_name asc
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllItemCategories);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Categoria de Bienes encontrados' : 'No se encontraron Categorias de Bienes',
            itemCategories: result?.recordset
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
module.exports.getAllItemCategories = getAllItemCategories;


const getItemCategoryById = async( itmcCode, itmcPurcCode) => {

    try {
        
        const sqlGetItemCategoryByID = `
                SELECT ROW_NUMBER() OVER(ORDER BY  t1.itmc_code ASC) AS id   
                    ,t1.itmc_code           AS itmcCode         
                    ,t1.itmc_purc_code      AS itmcPurcCode    
                    ,t2.purc_name           AS purcName         
                    ,t1.itmc_name           AS itmcName         
                    ,t1.itmc_description    AS itmcDescription  
                    ,t1.itmc_order          AS itmcOrder        
                    ,t1.itmc_parent_code    AS itmcParentCode  
                    ,t1.itmc_creation_date  AS itmcCreationDate
                    ,t1.itmc_status         AS itmcStatus  
                FROM dbo.tbl_item_categories t1
                WHERE t1.itmc_code = @itmcCode
                and  t1.itmc_purc_code = @itmcPurcCode
                order by t1.itmc_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmcCode',      sql.VarChar, itmcCode )                            
                            .input('itmcPurcCode',  sql.VarChar, itmcPurcCode )
                            .query(sqlGetItemCategoryByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getItemCategoryById = getItemCategoryById;

const getAllItemCategoriesByName = async(itmcName) => {

    const qryFindItemCategories = 
    `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.itmc_code ASC) AS id   
                ,t1.itmc_code           AS itmcCode         
                ,t1.itmc_purc_code      AS itmcPurcCode    
                ,t2.purc_name           AS purcName         
                ,t1.itmc_name           AS itmcName         
                ,t1.itmc_description    AS itmcDescription  
                ,t1.itmc_order          AS itmcOrder        
                ,t1.itmc_parent_code    AS itmcParentCode  
                ,t1.itmc_creation_date  AS itmcCreationDate
                ,t1.itmc_status         AS itmcStatus  
            FROM dbo.tbl_item_categories t1
            WHERE UPPER(t1.itmc_name)  LIKE UPPER(CONCAT('%',@itmcName,'%'))
                    AND t1.itmc_status = 'S' 
            order by t1.itmc_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmcName', sql.VarChar, itmcName )
                            .query(qryFindItemCategories);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Categorias de Bienes encontradas' : 'No se encontraron Categorias de Bienes',
            itemCategories: result?.recordset
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
module.exports.getAllItemCategoriesByName = getAllItemCategoriesByName;

const getAllItemCategoriesByPurcCode = async(itmcPurcCode) => {

    let respuesta;
    try {
        const sqlGetAllItemCategories = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.itmc_code ASC) AS id   
                ,t1.itmc_code           AS itmcCode         
                ,t1.itmc_purc_code      AS itmcPurcCode    
                ,t2.purc_name           AS purcName         
                ,t1.itmc_name           AS itmcName         
                ,t1.itmc_description    AS itmcDescription  
                ,t1.itmc_order          AS itmcOrder        
                ,t1.itmc_parent_code    AS itmcParentCode  
                ,t1.itmc_creation_date  AS itmcCreationDate
                ,t1.itmc_status         AS itmcStatus  
            FROM dbo.tbl_item_categories t1
            LEFT JOIN tbl_purchase_areas t2 ON t2.purc_code = t1.itmc_purc_code
            WHERE t1.itmc_parent_code = 0 
            and t1.itmc_status = 'S'
            and t1.itmc_purc_code = @itmcPurcCode
            order by t1.itmc_name asc
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmcPurcCode', sql.VarChar, itmcPurcCode )
                            .query(sqlGetAllItemCategories);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Categoria de Bienes encontrados' : 'No se encontraron Categorias de Bienes',
            itemCategories: result?.recordset
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
module.exports.getAllItemCategoriesByPurcCode = getAllItemCategoriesByPurcCode;

const getAllItemCategoriesByParentCode = async(itmcPurcCode, itmcParentCode) => {

    let respuesta;
    try {
        const sqlGetAllItemCategories = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.itmc_code ASC) AS id   
                    ,t1.itmc_code           AS itmcCode         
                    ,t1.itmc_purc_code      AS itmcPurcCode    
                    ,t2.purc_name           AS purcName         
                    ,t1.itmc_name           AS itmcName         
                    ,t1.itmc_description    AS itmcDescription  
                    ,t1.itmc_order          AS itmcOrder        
                    ,t1.itmc_parent_code    AS itmcParentCode  
                    ,t1.itmc_creation_date  AS itmcCreationDate
                    ,t1.itmc_status         AS itmcStatus  
            FROM dbo.tbl_item_categories t1
            LEFT JOIN tbl_purchase_areas t2 ON t2.purc_code = t1.itmc_purc_code
            WHERE t1.itmc_status = 'S'
              and t1.itmc_purc_code   = @itmcPurcCode
              and t1.itmc_parent_code = @itmcParentCode
            order by t1.itmc_name asc
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmcPurcCode', sql.VarChar, itmcPurcCode )
                            .input('itmcParentCode', sql.Int, itmcParentCode )
                            .query(sqlGetAllItemCategories);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Categoria de Bienes encontrados' : 'No se encontraron Categorias de Bienes',
            itemCategories: result?.recordset
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
module.exports.getAllItemCategoriesByParentCode = getAllItemCategoriesByParentCode;

const createItemCategory = async ( { 
    itmcPurcCode,
    itmcName,
    itmcDescription,
    itmcParentCode,
    itmcOrder,
    itmcStatus
    }) => {
        
    let respuesta;
    try {
        
        const sqlCreateItemCategory = `
            INSERT INTO dbo.tbl_item_categories
                    (
                     itmc_purc_code
                    ,itmc_name
                    ,itmc_description
                    ,itmc_order
                    ,itmc_parent_code
                    ,itmc_creation_date
                    ,itmc_status)
            VALUES
                    (@itmcPurcCode
                    ,@itmcName
                    ,@itmcdescription
                    ,@itmcOrder
                    ,@itmcParentCode
                    ,DBO.fncGetDate()
                    ,@itmcStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmcPurcCode',      sql.VarChar,  itmcPurcCode )
                            .input('itmcName',          sql.VarChar,  itmcName )
                            .input('itmcDescription',   sql.VarChar,  itmcDescription )
                            .input('itmcOrder',         sql.Int,      itmcOrder )
                            .input('itmcParentCode',    sql.VarChar,  itmcParentCode )                            
                            .input('itmcStatus',        sql.VarChar,  itmcStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateItemCategory);
        
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
module.exports.createItemCategory = createItemCategory;

const updateItemCategory = async( params, itmcCode,itmcPurcCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateItemCategory= `
        UPDATE tbl_item_categories
           SET ${columnSet}
         WHERE itmc_code = @itmcCode
         and itmc_purc_code = @itmcPurcCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmcCode',         sql.VarChar, itmcCode )
                            .input('itmcPurcCode',     sql.VarChar, itmcPurcCode )
                            .query(sqlUpdateItemCategory);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateItemCategory = updateItemCategory;

const deleteItemCategory = async ( itmcCode, itmcPurcCode ) => {
        
    try {
        
        const sqlDeleteItemCategory = `
        DELETE 
          FROM tbl_item_categories
        WHERE itmc_code = @itmcCode
          and itmc_purc_code = @itmcPurcCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itmcCode',     sql.VarChar, itmcCode )
                            .input('itmcPurcCode',     sql.VarChar, itmcPurcCode )
                            .query(sqlDeleteItemCategory);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteItemCategory = deleteItemCategory;
