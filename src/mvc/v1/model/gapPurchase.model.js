const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');
const purchaseModel = require('./gapPurchase.model');
const ProcessLogModel = require('./processLog.model');


const getAllGapPurchasesByParameters = async (
    gapProcId,
    gapProcCode,
    gapYear,
    gapPeriod,
    gapOrgCode,
    gapCampCode,
    gapSchoCode,
    gapCoursCode,
    gapItemCode,
    gapVolume,
    gapCityCode  
) => {

    let respuesta;
    try {
        const sqlGetAllGapPurchasesByParameters = `
        SELECT 
                  t1.gappd_proc_id                     AS    gappdProcId                               
                , t1.gappd_stock_type                  AS    gappdStockType    
                , t1.gappd_year                        AS    gappdYear
                , t1.gappd_city_code                   AS    gappdCityCode
                , t1.gappd_org_code                    AS    gappdOrgCode
                , t1.gappd_scho_code                   AS    gappdSchoCode
                , t3.scho_description                  AS    gappdSchoDescription
                , t1.gappd_cours_code                  AS    gappdCoursCode
                , t4.cours_description                 AS    gappdCourseDescription
                , t1.gappd_item_code                   AS    gappdItemCode
                , t5.item_description                  AS    gappdItemDescription
                , t1.gappd_camp_code                   AS    gappdCampCode
                , t2.camp_description                  AS    gappdCampDescription
                , t1.gappd_initial_gap                 AS    gappdInitialGap
                , t1.gappd_unit_value                  AS    gappdUnitValue
                , t1.gappd_list_number                 AS    gappdListNumber
                , t1.gappd_request_number              AS    gappdRequestNumber
                , t1.gappd_cacc_code                   AS    gappdCaccCode
                , t1.gappd_supplier_id                 AS    gappdSupplierId
                --, t1.gappd_reconciled_gap              AS    gappdReconciledGap
                --, t1.gappd_authorized_purchase         AS    gappdAuthorizedPurchase
                , t1.gappd_observation                 AS    gappdObservation
                , t1.gappd_description                 AS    gappdDescription
                , t1.gappd_total_required              AS    gappdTotalRequired
                --, t1.gappd_total_purchase_order        AS    gappdTotalPurchaseOrder
                --, t1.gappd_total_received              AS    gappdTotalReceived 
                , t1.gappd_volumes                     AS    gappdVolumes
                , t1.gappd_item_status                 AS    gappdItemStatus
                , t1.gappd_optimized_gap               AS    gappdOptimizedGap
                , t1.gappd_stock_difference            AS    gappdStockDifference

                FROM dbo.tbl_gaps_purchase_detail t1
                LEFT JOIN [dbo].[tbl_campus]  t2 ON t2.[camp_code]  = t1.[gappd_camp_code]   AND t2.[camp_org_code]  = t1.[gappd_org_code]
                LEFT JOIN [dbo].[tbl_schools] t3 ON t3.[scho_code]  = t1.[gappd_scho_code]   AND t3.[scho_org_code]  = t1.[gappd_org_code]
                LEFT JOIN [dbo].[tbl_courses] t4 ON t4.[cours_code] = t1.[gappd_cours_code]  AND t4.[cours_org_code] = t1.[gappd_org_code]
                LEFT JOIN [dbo].[tbl_items]   t5 ON t5.[item_code]  = t1.[gappd_item_code]   AND t5.[item_purc_code] = 'BIB'
                    
                WHERE
                            [gappd_proc_id]         = coalesce(@gapProcId            ,[gappd_proc_id])
                        AND [gappd_year]            = coalesce(@gapYear              ,[gappd_year])
                        AND [gappd_city_code]       = coalesce(@gapCityCode          ,[gappd_city_code])
                        AND [gappd_org_code]        = coalesce(@gapOrgCode           ,[gappd_org_code])
                        AND [gappd_camp_code]       = coalesce(@gapCampCode          ,[gappd_camp_code])
                        AND [gappd_scho_code]       = coalesce(@gapSchoCode          ,[gappd_scho_code])
                        AND [gappd_cours_code]      = coalesce(@gapCoursCode         ,[gappd_cours_code])
                        AND [gappd_item_code]       = coalesce(@gapItemCode          ,[gappd_item_code])
                        AND [gappd_volumes]         = coalesce(@gapVolume            ,[gappd_volumes]);
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('gapProcId',               sql.BigInt,  gapProcId)               
            .input('gapYear',                 sql.BigInt,  gapYear)     
            .input('gapCityCode',             sql.VarChar, gapCityCode)              
            .input('gapOrgCode',              sql.VarChar, gapOrgCode)              
            .input('gapCampCode',             sql.VarChar, gapCampCode)                   
            .input('gapSchoCode',             sql.VarChar, gapSchoCode)                     
            .input('gapCoursCode',            sql.VarChar, gapCoursCode)                  
            .input('gapItemCode',             sql.VarChar, gapItemCode)                     
            .input('gapVolume',               sql.VarChar, gapVolume)                  
            .query(sqlGetAllGapPurchasesByParameters);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Compras encontradas' : 'No se encontraron Compras',
            gapPurchases: result?.recordset
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
module.exports.getAllGapPurchasesByParameters = getAllGapPurchasesByParameters;
