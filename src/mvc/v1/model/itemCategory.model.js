
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const itemCategoryExist = async ( itmcName, itmcPurcCode ) => {

    let respuesta;
    try {
        const sqlItemCategoryExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Categorias de bienes ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_item_categories t1
                    WHERE t1.itmc_Name         =   $1
                    and t1.itmc_purc_code      =   $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlItemCategoryExist, [itmcName, itmcPurcCode]);

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
module.exports.itemCategoryExist = itemCategoryExist;

const getAllItemCategories = async() => {

    let respuesta;
    try {
        const sqlGetAllItemCategories = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.itmc_code ASC) AS id   
                ,t1.itmc_code           AS "itmcCode"         
                ,t1.itmc_purc_code      AS "itmcPurcCode"    
                ,t2.purc_name           AS "purcName"         
                ,t1.itmc_name           AS "itmcName"         
                ,t1.itmc_description    AS "itmcDescription"  
                ,t1.itmc_order          AS "itmcOrder"        
                ,t1.itmc_parent_code    AS "itmcParentCode"  
                ,t1.itmc_creation_date  AS "itmcCreationDate"
                ,t1.itmc_status         AS "itmcStatus"  
            FROM tbl_item_categories t1
            order by t1.itmc_name asc
        `;

        const result = await pool.query(sqlGetAllItemCategories);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Categoria de Bienes encontrados' : 'No se encontraron Categorias de Bienes',
            itemCategories: result?.rows
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
                    ,t1.itmc_code           AS "itmcCode"         
                    ,t1.itmc_purc_code      AS "itmcPurcCode"    
                    ,t2.purc_name           AS "purcName"         
                    ,t1.itmc_name           AS "itmcName"         
                    ,t1.itmc_description    AS "itmcDescription"  
                    ,t1.itmc_order          AS "itmcOrder"        
                    ,t1.itmc_parent_code    AS "itmcParentCode"  
                    ,t1.itmc_creation_date  AS "itmcCreationDate"
                    ,t1.itmc_status         AS "itmcStatus"  
                FROM tbl_item_categories t1
                WHERE t1.itmc_code = $1
                and  t1.itmc_purc_code = $2
                order by t1.itmc_code
        `;

        const result = await pool.query(sqlGetItemCategoryByID, [itmcCode, itmcPurcCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getItemCategoryById = getItemCategoryById;

const getAllItemCategoriesByName = async(itmcName) => {

    const qryFindItemCategories = 
    `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.itmc_code ASC) AS id   
                ,t1.itmc_code           AS "itmcCode"         
                ,t1.itmc_purc_code      AS "itmcPurcCode"    
                ,t2.purc_name           AS "purcName"         
                ,t1.itmc_name           AS "itmcName"         
                ,t1.itmc_description    AS "itmcDescription"  
                ,t1.itmc_order          AS "itmcOrder"        
                ,t1.itmc_parent_code    AS "itmcParentCode"  
                ,t1.itmc_creation_date  AS "itmcCreationDate"
                ,t1.itmc_status         AS "itmcStatus"  
            FROM tbl_item_categories t1
            WHERE UPPER(t1.itmc_name)  LIKE UPPER(CONCAT('%',$1,'%'))
                    AND t1.itmc_status = 'S' 
            order by t1.itmc_code
    `;
    
    try {
        const result = await pool.query(qryFindItemCategories, [itmcName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Categorias de Bienes encontradas' : 'No se encontraron Categorias de Bienes',
            itemCategories: result?.rows
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
                ,t1.itmc_code           AS "itmcCode"         
                ,t1.itmc_purc_code      AS "itmcPurcCode"    
                ,t2.purc_name           AS "purcName"         
                ,t1.itmc_name           AS "itmcName"         
                ,t1.itmc_description    AS "itmcDescription"  
                ,t1.itmc_order          AS "itmcOrder"        
                ,t1.itmc_parent_code    AS "itmcParentCode"  
                ,t1.itmc_creation_date  AS "itmcCreationDate"
                ,t1.itmc_status         AS "itmcStatus"  
            FROM tbl_item_categories t1
            LEFT JOIN tbl_purchase_areas t2 ON t2.purc_code = t1.itmc_purc_code
            WHERE t1.itmc_parent_code = 0 
            and t1.itmc_status = 'S'
            and t1.itmc_purc_code = $1
            order by t1.itmc_name asc
        `;

        const result = await pool.query(sqlGetAllItemCategories, [itmcPurcCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Categoria de Bienes encontrados' : 'No se encontraron Categorias de Bienes',
            itemCategories: result?.rows
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
                    ,t1.itmc_code           AS "itmcCode"         
                    ,t1.itmc_purc_code      AS "itmcPurcCode"    
                    ,t2.purc_name           AS "purcName"         
                    ,t1.itmc_name           AS "itmcName"         
                    ,t1.itmc_description    AS "itmcDescription"  
                    ,t1.itmc_order          AS "itmcOrder"        
                    ,t1.itmc_parent_code    AS "itmcParentCode"  
                    ,t1.itmc_creation_date  AS "itmcCreationDate"
                    ,t1.itmc_status         AS "itmcStatus"  
            FROM tbl_item_categories t1
            LEFT JOIN tbl_purchase_areas t2 ON t2.purc_code = t1.itmc_purc_code
            WHERE t1.itmc_status = 'S'
              and t1.itmc_purc_code   = $1
              and t1.itmc_parent_code = @itmcParentCode
            order by t1.itmc_name asc
        `;

        const result = await pool.query(sqlGetAllItemCategories, [itmcPurcCode, itmcParentCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Categoria de Bienes encontrados' : 'No se encontraron Categorias de Bienes',
            itemCategories: result?.rows
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
            INSERT INTO tbl_item_categories
                    (
                     itmc_purc_code
                    ,itmc_name
                    ,itmc_description
                    ,itmc_order
                    ,itmc_parent_code
                    ,itmc_creation_date
                    ,itmc_status)
            VALUES
                    ($1
                    ,$2
                    ,@itmcdescription
                    ,$4
                    ,$5
                    ,NOW()
                    ,$6)
        `;

        const result = await pool.query(sqlCreateItemCategory, [itmcPurcCode, itmcName, itmcDescription, itmcOrder, itmcParentCode, itmcStatus]);
        
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
module.exports.createItemCategory = createItemCategory;

const updateItemCategory = async( params, itmcCode,itmcPurcCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateItemCategory= `
        UPDATE tbl_item_categories
           SET ${columnSet}
         WHERE itmc_code = $1
         and itmc_purc_code = $2
        `;

        const result = await pool.query(sqlUpdateItemCategory, [itmcCode, itmcPurcCode]);
        
        return result?.rowCount;
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
        WHERE itmc_code = $1
          and itmc_purc_code = $2
        `;

        const result = await pool.query(sqlDeleteItemCategory, [itmcCode, itmcPurcCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteItemCategory = deleteItemCategory;
