const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const itemExist = async ( itemName, itemPurcCode ) => {
    
    let respuesta;
    try {
        const sqlItemxist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Clase de Articulo ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_items t1
                    WHERE t1.item_name           =   @itemName
                    and t1.item_purc_code      =   @itemPurcCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itemName',  sql.VarChar, itemName )
                            .input('itemPurcCode',  sql.VarChar, itemPurcCode )
                            .query(sqlItemxist);

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
module.exports.itemExist = itemExist;

const getAllItems = async(orgCode, purcCode, famCode, subFamCode) => {

    let respuesta;
    try {
        const sqlGetAllItems = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.item_code ASC) AS id    
                ,t1.item_code              AS itemCode
                ,t1.item_purc_code         AS itemPurcCode        
                ,t3.purc_name              AS itemPurcName             
                ,t1.item_description       AS itemDescription      
                ,t1.item_name              AS itemName             
                ,t1.item_itmc_code         AS itemItmcSubFamCode        
                ,t2.itmc_name              AS itemItmcSubFamName   
                ,t4.itmc_code              AS itemItmcFamCode        
                ,t4.itmc_name              AS itemItmcFamName  				
                ,t1.item_renewal_cycle     AS itemRenewalCycle    
                ,t1.item_maintenance_cycle AS itemMaintenanceCycle
                ,t1.item_currency_code     AS itemCurrencyCode    
                ,t1.item_unit_value        AS itemUnitValue 
                ,t1.item_isbn              AS itemIsbn                          
                ,t1.item_attribute_01      AS itemAttribute01     
                ,t1.item_value_01          AS itemValue01         
                ,t1.item_attribute_02      AS itemAttribute02     
                ,t1.item_value_02          AS itemValue02         
                ,t1.item_attribute_03      AS itemAttribute03     
                ,t1.item_value_03          AS itemValue03         
                ,t1.item_attribute_04      AS itemAttribute04     
                ,t1.item_value_04          AS itemValue04         
                ,t1.item_creation_date     AS itemCreationDate    
                ,t1.item_status            AS itemStatus  
                ,'[' + CAST( t1.item_code as varchar(max))  + '] ' + t1.item_name + ' [' + t4.itmc_name + '][' + t2.itmc_name  + ']' as itemOptionLabel
            FROM dbo.tbl_items t1, 
                dbo.tbl_item_categories t2,
                dbo.tbl_purchase_areas t3,
                dbo.tbl_item_categories t4
            WHERE t1.item_itmc_code = t2.itmc_code
            and t1.item_purc_code   = t3.purc_code
            and t2.itmc_parent_code = t4.itmc_code
            and t1.item_purc_code   = coalesce(@purcCode,t1.item_purc_code)
            and t1.item_itmc_code   = coalesce(@subFamCode,t1.item_itmc_code) 
            and t4.itmc_code        = coalesce(@famCode,t4.itmc_code) 
            order by t1.item_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode',    sql.VarChar, purcCode )                            
                            .input('subFamCode',  sql.Int,     subFamCode )
                            .input('famCode',     sql.Int,     famCode )
                            .query(sqlGetAllItems);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Clases de Articulos encontrados' : 'No se encontraron Clases de Articulos',
            items: result?.recordset
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
module.exports.getAllItems = getAllItems;


const getItemById = async( itemCode, itemPurcCode) => {

    try {
        
        const sqlGetItemsByID = `

            SELECT ROW_NUMBER() OVER(ORDER BY  t1.item_code ASC) AS id    
                ,t1.item_code              AS itemCode
                ,t1.item_purc_code         AS itemPurcCode        
                ,t3.purc_name              AS itemPurcName             
                ,t1.item_description       AS itemDescription      
                ,t1.item_name              AS itemName             
                ,t1.item_itmc_code         AS itemItmcSubFamCode        
                ,t2.itmc_name              AS itmcSubFamName   
                ,t4.itmc_code              AS itemItmcFamCode        
                ,t4.itmc_name              AS itmcFamName  				
                ,t1.item_renewal_cycle     AS itemRenewalCycle    
                ,t1.item_maintenance_cycle AS itemMaintenanceCycle
                ,t1.item_currency_code     AS itemCurrencyCode    
                ,t1.item_unit_value        AS itemUnitValue    
                ,t1.item_isbn              AS itemIsbn                       
                ,t1.item_attribute_01      AS itemAttribute01     
                ,t1.item_value_01          AS itemValue01         
                ,t1.item_attribute_02      AS itemAttribute02     
                ,t1.item_value_02          AS itemValue02         
                ,t1.item_attribute_03      AS itemAttribute03     
                ,t1.item_value_03          AS itemValue03         
                ,t1.item_attribute_04      AS itemAttribute04     
                ,t1.item_value_04          AS itemValue04         
                ,t1.item_creation_date     AS itemCreationDate    
                ,t1.item_status            AS itemStatus  
            FROM dbo.tbl_items t1, 
                dbo.tbl_item_categories t2,
                dbo.tbl_purchase_areas t3,
                dbo.tbl_item_categories t4
            WHERE t1.item_itmc_code = t2.itmc_code
            and t1.item_purc_code = t3.purc_code
            and t2.itmc_parent_code = t4.itmc_code
            and t1.item_code = @itemCode
            and t1.item_purc_code = @itemPurcCode
            order by t1.item_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itemCode',      sql.VarChar, itemCode )                            
                            .input('itemPurcCode',  sql.VarChar, itemPurcCode )
                            .query(sqlGetItemsByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getItemById = getItemById;

const getAllItemsByName = async(itemName) => {

    const qryFindItems = 
    `               
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.item_code ASC) AS id    
            ,t1.item_code              AS itemCode
            ,t1.item_purc_code         AS itemPurcCode        
            ,t3.purc_name              AS itemPurcName             
            ,t1.item_description       AS itemDescription      
            ,t1.item_name              AS itemName             
            ,t1.item_itmc_code         AS itemItmcSubFamCode        
            ,t2.itmc_name              AS itmcSubFamName   
            ,t4.itmc_code              AS itemItmcFamCode        
            ,t4.itmc_name              AS itmcFamName  				
            ,t1.item_renewal_cycle     AS itemRenewalCycle    
            ,t1.item_maintenance_cycle AS itemMaintenanceCycle
            ,t1.item_currency_code     AS itemCurrencyCode    
            ,t1.item_unit_value        AS itemUnitValue  
            ,t1.item_isbn              AS itemIsbn                     
            ,t1.item_attribute_01      AS itemAttribute01     
            ,t1.item_value_01          AS itemValue01         
            ,t1.item_attribute_02      AS itemAttribute02     
            ,t1.item_value_02          AS itemValue02         
            ,t1.item_attribute_03      AS itemAttribute03     
            ,t1.item_value_03          AS itemValue03         
            ,t1.item_attribute_04      AS itemAttribute04     
            ,t1.item_value_04          AS itemValue04         
            ,t1.item_creation_date     AS itemCreationDate    
            ,t1.item_status            AS itemStatus  
        FROM dbo.tbl_items t1, 
            dbo.tbl_item_categories t2,
            dbo.tbl_purchase_areas t3,
            dbo.tbl_item_categories t4
        WHERE t1.item_itmc_code = t2.itmc_code
        and t1.item_purc_code = t3.purc_code
        and t2.itmc_parent_code = t4.itmc_code
        and UPPER(t1.item_name)  LIKE UPPER(CONCAT('%',@itemName,'%'))
        and t1.item_status = 'S'  
        order by t1.item_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itemName', sql.VarChar, itemName )
                            .query(qryFindItems);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Clases de Articulos encontradas' : 'No se encontraron Clases de Articulos',
            items: result?.recordset
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
module.exports.getAllItemsByName = getAllItemsByName;

const getAllItemsByParentCode = async(itemPurcCode,itemItmcCode) => {

    let respuesta;
    try {
        const sqlGetAllItemsByParentCode = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.item_code ASC) AS id    
                ,t1.item_code              AS itemCode
                ,t1.item_purc_code         AS itemPurcCode        
                ,t3.purc_name              AS itemPurcName             
                ,t1.item_description       AS itemDescription      
                ,t1.item_name              AS itemName             
                ,t1.item_itmc_code         AS itemItmcSubFamCode        
                ,t2.itmc_name              AS itmcSubFamName   
                ,t4.itmc_code              AS itemItmcFamCode        
                ,t4.itmc_name              AS itmcFamName  				
                ,t1.item_renewal_cycle     AS itemRenewalCycle    
                ,t1.item_maintenance_cycle AS itemMaintenanceCycle
                ,t1.item_currency_code     AS itemCurrencyCode    
                ,t1.item_unit_value        AS itemUnitValue  
                ,t1.item_isbn              AS itemIsbn      
                ,t1.item_attribute_01      AS itemAttribute01     
                ,t1.item_value_01          AS itemValue01         
                ,t1.item_attribute_02      AS itemAttribute02     
                ,t1.item_value_02          AS itemValue02         
                ,t1.item_attribute_03      AS itemAttribute03     
                ,t1.item_value_03          AS itemValue03         
                ,t1.item_attribute_04      AS itemAttribute04     
                ,t1.item_value_04          AS itemValue04         
                ,t1.item_creation_date     AS itemCreationDate    
                ,t1.item_status            AS itemStatus  
            FROM dbo.tbl_items t1, 
                dbo.tbl_item_categories t2,
                dbo.tbl_purchase_areas t3,
                dbo.tbl_item_categories t4
            WHERE t1.item_itmc_code = t2.itmc_code
            and t1.item_purc_code = t3.purc_code
            and t2.itmc_parent_code = t4.itmc_code
            and t1.item_purc_code = @itemPurcCode
            and t1.item_itmc_code = @itemItmcCode
            order by t1.item_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itemPurcCode',   sql.VarChar, itemPurcCode )
                            .input('itemItmcCode',   sql.VarChar, itemItmcCode )
                            .query(sqlGetAllItemsByParentCode);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Clases de Articulos encontrados' : 'No se encontraron Clases de Articulos',
            items: result?.recordset
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
module.exports.getAllItemsByParentCode = getAllItemsByParentCode;

const createItem = async ( { 
    itemPurcCode,  
    itemDescription,  
    itemName, 
    itemItmcCode,
    itemRenewalCycle, 
    itemMaintenanceCycle, 
    itemCurrencyCode,
    itemUnitValue,
    itemIsbn,
    itemAttribute01,
    itemValue01,
    itemAttribute02,
    itemValue02,
    itemAttribute03,
    itemValue03,
    itemAttribute04,
    itemValue04,
    itemStatus
    }) => {
        
    let respuesta;
    try {
        
        const sqlCreateItem = `
            INSERT INTO tbl_items
                    (
                     item_purc_code
                    ,item_description
                    ,item_name
                    ,item_itmc_code
                    ,item_renewal_cycle
                    ,item_maintenance_cycle
                    ,item_currency_code
                    ,item_unit_value
                    ,item.item_isbn              
                    ,item_attribute_01
                    ,item_value_01
                    ,item_attribute_02
                    ,item_value_02
                    ,item_attribute_03
                    ,item_value_03
                    ,item_attribute_04
                    ,item_value_04
                    ,item_creation_date
                    ,item_status)
            VALUES
                    ( 
                     @itemPurcCode
                    ,@itemDescription
                    ,@itemName
                    ,@itemItmcCode
                    ,@itemRenewalCycle 
                    ,@itemMaintenanceCycle 
                    ,@itemCurrencyCode
                    ,@itemUnitValue
                    ,@itemIsbn
                    ,@itemAttribute01
                    ,@itemValue01
                    ,@itemAttribute02
                    ,@itemValue02
                    ,@itemAttribute03
                    ,@itemValue03
                    ,@itemAttribute04
                    ,@itemValue04
                    ,DBO.fncGetDate()
                    ,@itemStatus)
                    SELECT SCOPE_IDENTITY() as itemCode   
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itemPurcCode',        sql.VarChar,  itemPurcCode)
                            .input('itemDescription',     sql.VarChar,  itemDescription)
                            .input('itemName',            sql.VarChar,  itemName)
                            .input('itemItmcCode',        sql.Int,      itemItmcCode)
                            .input('itemRenewalCycle',    sql.Int,      itemRenewalCycle)
                            .input('itemMaintenanceCycle',sql.Int,      itemMaintenanceCycle)
                            .input('itemCurrencyCode',    sql.VarChar,  itemCurrencyCode)
                            .input('itemUnitValue',       sql.Decimal,  itemUnitValue)
                            .input('itemIsbn     ',       sql.VarChar,  itemIsbn)
                            .input('itemAttribute01',     sql.VarChar,  itemAttribute01)
                            .input('itemValue01',         sql.VarChar,  itemValue01)
                            .input('itemAttribute02',     sql.VarChar,  itemAttribute02)
                            .input('itemValue02',         sql.VarChar,  itemValue02)
                            .input('itemAttribute03',     sql.VarChar,  itemAttribute03)
                            .input('itemValue03',         sql.VarChar,  itemValue03)
                            .input('itemAttribute04',     sql.VarChar,  itemAttribute04)
                            .input('itemValue04',         sql.VarChar,  itemValue04)
                            .input('itemStatus',          sql.VarChar,  itemStatus)
                            .query(sqlCreateItem);
        
        const affectedRows = result.rowsAffected[0];
        const itemCode = result.recordset[0].itemCode;

        respuesta = {
            type: !affectedRows ? 'error' : 'ok',
            status: 200,
            id:itemCode,
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
module.exports.createItem = createItem;

const updateItem = async( params, itemCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateItem= `
        UPDATE tbl_items
           SET ${columnSet}
         WHERE item_code = @itemCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itemCode',         sql.Int, itemCode )
                            .query(sqlUpdateItem);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateItem = updateItem;

const deleteItem = async ( itemCode ) => {
        
    try {
        
        const sqlDeleteItem = `
        DELETE 
          FROM tbl_items
        WHERE item_code = @itemCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('itemCode',         sql.Int, itemCode )
                            .query(sqlDeleteItem);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteItem = deleteItem;
