
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');
const ProcessModel = require('./process.model');
const ProcessLogModel = require('./processLog.model');


const getAllGapDemandVsStockByParameters = async (
    gapProcId,
    gapProcCode,
    gapStdcAcademicYear,
    gapStdcAcademicPeriod,
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
        const sqlGetAllGapDemandVsStock = `
        SELECT 
             t1.[gapr_proc_id]             as gaprProcId  
            ,t1.[gapr_proc_code]           as gaprProcCode          
            ,t1.[gapr_academic_year]       as gaprAcademicYear   
            ,t1.[gapr_academic_period]     as gaprAcademicPeriod
            ,t1.[gapr_city_code]           as gaprCityCode
            ,t1.[gapr_org_code]            as gaprOrgCode
            ,t1.[gapr_scho_code]           as gaprSchoCode
            ,t3.[scho_description]         as gaprSchoDescription
            ,t1.[gapr_cours_code]          as gaprCoursCode
            ,t4.[cours_description]        as gaprCoursDescription
            ,t1.[gapr_item_code]           as gaprItemCode
            ,t1.[gapr_camp_code]           as gaprCampCode
            ,t2.[camp_description]         as gaprCampDescription
            ,t1.[gapr_city_stock_fi]       as gaprCityStockFi
            ,t1.[gapr_city_stock_dr]       as gaprCityStockDr
            ,t1.[gapr_city_stock_di]       as gaprCityStockDi
            ,t1.[gapr_national_stock]      as gaprNationalStock
            ,t1.[gapr_student_quantity]    as gaprStudentQuantity
            ,t1.[gapr_demand]              as gaprDemand
            ,t1.[gapr_gap]                 as gaprGap
            ,t1.[gapr_item_active]         as gaprItemActive
            ,t1.[gapr_title]               as gaprTitle
            ,t1.[gapr_author]              as gaprAuthor
            ,t1.[gapr_publisher]           as gaprPublisher
            ,CASE t1.[gapr_volume]
            WHEN 'X' THEN 'Sin Info.'
            ELSE t1.[gapr_volume]
            END gaprVolume
            ,coalesce(t1.[gapr_observation],'CALCULO BRECHA NORMAL') gaprObservation
        FROM tbl_gaps_dda_vs_stock t1
    
        LEFT JOIN tbl_campus t2 ON t2.[camp_code]   = t1.[gapr_camp_code]   AND t2.[camp_org_code] = t1.[gapr_org_code]
        LEFT JOIN tbl_schools t3 ON t3.[scho_code]  = t1.[gapr_scho_code]   AND t3.[scho_org_code] = t1.[gapr_org_code]
        LEFT JOIN tbl_courses t4 ON t4.[cours_code] = t1.[gapr_cours_code]  AND t4.[cours_org_code]= t1.[gapr_org_code]
    
        WHERE
                    [gapr_proc_id]         = coalesce($1            ,[gapr_proc_id])
                AND [gapr_academic_year]   = coalesce($3  ,[gapr_academic_year])
                AND [gapr_academic_period] = coalesce($4,[gapr_academic_period])
                AND [gapr_city_code]       = coalesce($5          ,[gapr_city_code])
                AND [gapr_org_code]        = coalesce($6           ,[gapr_org_code])
                AND [gapr_camp_code]       = coalesce($7          ,[gapr_camp_code])
                AND [gapr_scho_code]       = coalesce($8          ,[gapr_scho_code])
                AND [gapr_cours_code]      = coalesce($9         ,[gapr_cours_code])
                AND [gapr_item_code]       = coalesce($10          ,[gapr_item_code])
                AND [gapr_volume]          = coalesce($11            ,[gapr_volume]);
        `;

        const result = await pool.query(sqlGetAllGapDemandVsStock, [gapProcId, gapProcCode, gapStdcAcademicYear, gapStdcAcademicPeriod, gapCityCode, gapOrgCode, gapCampCode, gapSchoCode, gapCoursCode, gapItemCode, gapVolume]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Brecha dda vs stk encontradas' : 'No se encontraron Brechas dda vs stk',
            gapsDda: result?.rows
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
module.exports.getAllGapDemandVsStockByParameters = getAllGapDemandVsStockByParameters;

const getAllGapStockVsDemandByParameters = async (
    gapProcId,
    gapProcCode,
    gapStdcAcademicYear,
    gapStdcAcademicPeriod,
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
        const sqlGetAllGapStockVsDemand = `
        SELECT 
             t1.[gapr_proc_id]             as gaprProcId    
            ,t1.[gapr_proc_code]           as gaprProcCode       
            ,t1.[gapr_academic_year]       as gaprAcademicYear   
            ,t1.[gapr_academic_period]     as gaprAcademicPeriod
            ,t1.[gapr_city_code]           as gaprCityCode
            ,t1.[gapr_org_code]            as gaprOrgCode
            ,t1.[gapr_scho_code]           as gaprSchoCode
            ,t3.[scho_description]         as gaprSchoDescription
            ,t1.[gapr_cours_code]          as gaprCoursCode
            ,t4.[cours_description]        as gaprCoursDescription
            ,t1.[gapr_item_code]           as gaprItemCode
            ,t1.[gapr_camp_code]           as gaprCampCode
            ,t2.[camp_description]         as gaprCampDescription
            ,t1.[gapr_city_stock_fi]       as gaprCityStockFi
            ,t1.[gapr_city_stock_dr]       as gaprCityStockDr
            ,t1.[gapr_city_stock_di]       as gaprCityStockDi
            ,t1.[gapr_national_stock]      as gaprNationalStock
            ,t1.[gapr_student_quantity]    as gaprStudentQuantity
            ,t1.[gapr_demand]              as gaprDemand
            ,t1.[gapr_gap]                 as gaprGap
            ,t1.[gapr_item_active]         as gaprItemActive
            ,t1.[gapr_title]               as gaprTitle
            ,t1.[gapr_author]              as gaprAuthor
            ,t1.[gapr_publisher]           as gaprPublisher
            ,CASE t1.[gapr_volume]
            WHEN 'X' THEN 'Sin Info.'
            ELSE t1.[gapr_volume]
            END gaprVolume
            ,coalesce(t1.[gapr_observation],'CALCULO BRECHA NORMAL') gaprObservation
        FROM tbl_gaps_dda_vs_stock t1
    
        LEFT JOIN tbl_campus t2 ON t2.[camp_code]   = t1.[gapr_camp_code]   AND t2.[camp_org_code] = t1.[gapr_org_code]
        LEFT JOIN tbl_schools t3 ON t3.[scho_code]  = t1.[gapr_scho_code]   AND t3.[scho_org_code] = t1.[gapr_org_code]
        LEFT JOIN tbl_courses t4 ON t4.[cours_code] = t1.[gapr_cours_code]  AND t4.[cours_org_code]= t1.[gapr_org_code]
    
        WHERE
                    [gapr_proc_id]         = coalesce($1            ,[gapr_proc_id])
                AND [gapr_academic_year]   = coalesce($3  ,[gapr_academic_year])
                AND [gapr_academic_period] = coalesce($4,[gapr_academic_period])
                AND [gapr_city_code]       = coalesce($5          ,[gapr_city_code])
                AND [gapr_org_code]        = coalesce($6           ,[gapr_org_code])
                AND [gapr_camp_code]       = coalesce($7          ,[gapr_camp_code])
                AND [gapr_scho_code]       = coalesce($8          ,[gapr_scho_code])
                AND [gapr_cours_code]      = coalesce($9         ,[gapr_cours_code])
                AND [gapr_item_code]       = coalesce($10          ,[gapr_item_code])
                AND [gapr_volume]          = coalesce($11            ,[gapr_volume]);
        `;

        const result = await pool.query(sqlGetAllGapStockVsDemand, [gapProcId, gapProcCode, gapStdcAcademicYear, gapStdcAcademicPeriod, gapCityCode, gapOrgCode, gapCampCode, gapSchoCode, gapCoursCode, gapItemCode, gapVolume]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Brecha stk vs dda encontradas' : 'No se encontraron Brechas stk vs dda',
            gapsStk: result?.rows
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
module.exports.getAllGapStockVsDemandByParameters = getAllGapStockVsDemandByParameters;

const gapCalculation = async ({
    header
}) => {

    let respuesta;
    const todaysDate = new Date();
    const currentYear = todaysDate.getFullYear();
    const currentMonth = todaysDate.getMonth();
    const currentDay = todaysDate.getDay();
    const currentMinutes = todaysDate.getMinutes();

    let headerProcess = {
          procPurcCode: header.proc_purc_code
        , procProctId: 1
        , procScheduledDate: todaysDate
        , procEmailNotification: header.proc_email_notification
        , procCode: currentYear + '' + currentMonth + '' + currentDay + '' + currentMinutes
        , procFile: null
        , procFileUploaded: null
        , procStatus: "P"
        , procStock: header.procStock
        , procDemand: header.procDemand
        , procStandard: header.procStandard
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insertar registro en tabla de procesos.
        let resultProcess = await ProcessModel.createProcess(headerProcess);
        let log = {
             proclProcId:resultProcess.procId
            ,proclLog : `Gap Calculation ${headerProcess.procCode} started at: ${new Date()} with procStock: ${headerProcess.procStock}, procDemand: ${headerProcess.procDemand}, procStandard: ${headerProcess.procStandard}`
        };
        let resultLogStart = await ProcessLogModel.createProcessLog(log);

        // Ejecuta función PostgreSQL p01_run_brecha_bib
        // TODO: La función p01_run_brecha_bib debe ser creada en PostgreSQL
        const result = await client.query(
            'SELECT * FROM p01_run_brecha_bib($1, $2, $3, $4, $5, $6)',
            [resultProcess.procId, headerProcess.procCode, headerProcess.procPurcCode,
             headerProcess.procStock, headerProcess.procDemand, headerProcess.procStandard]
        );

        await client.query('COMMIT');
        respuesta = {
            type: 'ok',
            status: 200,
            message: {status:"Brecha Calculation Succes",
                      procCode:headerProcess.procCode},
        };

        log = {
            proclProcId:resultProcess.procId
           ,proclLog : `Gap Calculation Success:${headerProcess.procCode} ${JSON.stringify(respuesta.message)} at: ${new Date()} with procStock: ${headerProcess.procStock}, procDemand: ${headerProcess.procDemand}, procStandard: ${headerProcess.procStandard}`
        };
        let resultLogSuccess = await ProcessLogModel.createProcessLog(log);

    } catch (error) {
        await client.query('ROLLBACK');
        respuesta = {
            type: 'error',
            status: 400,
            message: error.message,
        };

        log = {
            proclProcId:resultProcess ? resultProcess.procId : null
           ,proclLog : `Gap Calculation ${headerProcess.procCode} error at: ${new Date()} with procStock: ${headerProcess.procStock}, procDemand: ${headerProcess.procDemand}, procStandard: ${headerProcess.procStandard}`
        };
        let resultProcessEnd = await ProcessLogModel.createProcessLog(log);
    } finally {
        client.release();
    };

    return respuesta;
};
module.exports.gapCalculation = gapCalculation;

const getAllGapPeriodsDda = async() => {

    let respuesta;
    try {
        const sqlDemandPeriods = `
        SELECT DISTINCT 
             [gapr_academic_year]            AS "gaprAcademicYear"
            ,[gapr_academic_period]          AS "gaprAcademicPeriod"
            ,CONCAT([gapr_academic_year] , '-' , [gapr_academic_period]) AS "gaprDemandPeriod"
        FROM tbl_gaps_dda_vs_stock
        `;

        const result = await pool.query(sqlDemandPeriods);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Periodos de la Brecha dda encontrados' : 'No se encontraron Periodos de la Brecha dda',
            gapPeriodsDda: result?.rows
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
module.exports.getAllGapPeriodsDda = getAllGapPeriodsDda;

const getAllGapPeriodsStk = async() => {

    let respuesta;
    try {
        const sqlStkPeriods = `
        SELECT DISTINCT 
             [gapr_academic_year]            AS "gaprAcademicYear"
            ,[gapr_academic_period]          AS "gaprAcademicPeriod"
            ,CONCAT([gapr_academic_year] , '-' , [gapr_academic_period]) AS "gaprDemandPeriod"
        FROM tbl_gaps_stock_vs_dda
        `;

        const result = await pool.query(sqlStkPeriods);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Periodos de la Brecha stk encontrados' : 'No se encontraron Periodos de la Brecha stk',
            gapPeriodsStk: result?.rows
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
module.exports.getAllGapPeriodsStk = getAllGapPeriodsStk;




