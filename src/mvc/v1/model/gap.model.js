const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
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
        FROM [dbo].[tbl_gaps_dda_vs_stock] t1
    
        LEFT JOIN [dbo].[tbl_campus] t2 ON t2.[camp_code]   = t1.[gapr_camp_code]   AND t2.[camp_org_code] = t1.[gapr_org_code]
        LEFT JOIN [dbo].[tbl_schools] t3 ON t3.[scho_code]  = t1.[gapr_scho_code]   AND t3.[scho_org_code] = t1.[gapr_org_code]
        LEFT JOIN [dbo].[tbl_courses] t4 ON t4.[cours_code] = t1.[gapr_cours_code]  AND t4.[cours_org_code]= t1.[gapr_org_code]
    
        WHERE
                    [gapr_proc_id]         = coalesce(@gapProcId            ,[gapr_proc_id])
                AND [gapr_academic_year]   = coalesce(@gapStdcAcademicYear  ,[gapr_academic_year])
                AND [gapr_academic_period] = coalesce(@gapStdcAcademicPeriod,[gapr_academic_period])
                AND [gapr_city_code]       = coalesce(@gapCityCode          ,[gapr_city_code])
                AND [gapr_org_code]        = coalesce(@gapOrgCode           ,[gapr_org_code])
                AND [gapr_camp_code]       = coalesce(@gapCampCode          ,[gapr_camp_code])
                AND [gapr_scho_code]       = coalesce(@gapSchoCode          ,[gapr_scho_code])
                AND [gapr_cours_code]      = coalesce(@gapCoursCode         ,[gapr_cours_code])
                AND [gapr_item_code]       = coalesce(@gapItemCode          ,[gapr_item_code])
                AND [gapr_volume]          = coalesce(@gapVolume            ,[gapr_volume]);
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('gapProcId',               sql.BigInt,  gapProcId)               
            .input('gapProcCode',             sql.VarChar, gapProcCode)           
            .input('gapStdcAcademicYear',     sql.BigInt,  gapStdcAcademicYear)     
            .input('gapStdcAcademicPeriod',   sql.BigInt,  gapStdcAcademicPeriod)   
            .input('gapCityCode',             sql.VarChar, gapCityCode)              
            .input('gapOrgCode',              sql.VarChar, gapOrgCode)              
            .input('gapCampCode',             sql.VarChar, gapCampCode)                   
            .input('gapSchoCode',             sql.VarChar, gapSchoCode)                     
            .input('gapCoursCode',            sql.VarChar, gapCoursCode)                  
            .input('gapItemCode',             sql.VarChar, gapItemCode)                     
            .input('gapVolume',               sql.VarChar, gapVolume)                  
            .query(sqlGetAllGapDemandVsStock);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Brecha dda vs stk encontradas' : 'No se encontraron Brechas dda vs stk',
            gapsDda: result?.recordset
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
        FROM [dbo].[tbl_gaps_dda_vs_stock] t1
    
        LEFT JOIN [dbo].[tbl_campus] t2 ON t2.[camp_code]   = t1.[gapr_camp_code]   AND t2.[camp_org_code] = t1.[gapr_org_code]
        LEFT JOIN [dbo].[tbl_schools] t3 ON t3.[scho_code]  = t1.[gapr_scho_code]   AND t3.[scho_org_code] = t1.[gapr_org_code]
        LEFT JOIN [dbo].[tbl_courses] t4 ON t4.[cours_code] = t1.[gapr_cours_code]  AND t4.[cours_org_code]= t1.[gapr_org_code]
    
        WHERE
                    [gapr_proc_id]         = coalesce(@gapProcId            ,[gapr_proc_id])
                AND [gapr_academic_year]   = coalesce(@gapStdcAcademicYear  ,[gapr_academic_year])
                AND [gapr_academic_period] = coalesce(@gapStdcAcademicPeriod,[gapr_academic_period])
                AND [gapr_city_code]       = coalesce(@gapCityCode          ,[gapr_city_code])
                AND [gapr_org_code]        = coalesce(@gapOrgCode           ,[gapr_org_code])
                AND [gapr_camp_code]       = coalesce(@gapCampCode          ,[gapr_camp_code])
                AND [gapr_scho_code]       = coalesce(@gapSchoCode          ,[gapr_scho_code])
                AND [gapr_cours_code]      = coalesce(@gapCoursCode         ,[gapr_cours_code])
                AND [gapr_item_code]       = coalesce(@gapItemCode          ,[gapr_item_code])
                AND [gapr_volume]          = coalesce(@gapVolume            ,[gapr_volume]);
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('gapProcId',               sql.BigInt,  gapProcId)               
            .input('gapProcCode',             sql.VarChar, gapProcCode)           
            .input('gapStdcAcademicYear',     sql.BigInt,  gapStdcAcademicYear)     
            .input('gapStdcAcademicPeriod',   sql.BigInt,  gapStdcAcademicPeriod)   
            .input('gapCityCode',             sql.VarChar, gapCityCode)              
            .input('gapOrgCode',              sql.VarChar, gapOrgCode)              
            .input('gapCampCode',             sql.VarChar, gapCampCode)                   
            .input('gapSchoCode',             sql.VarChar, gapSchoCode)                     
            .input('gapCoursCode',            sql.VarChar, gapCoursCode)                  
            .input('gapItemCode',             sql.VarChar, gapItemCode)                     
            .input('gapVolume',               sql.VarChar, gapVolume)                  
            .query(sqlGetAllGapStockVsDemand);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Brecha stk vs dda encontradas' : 'No se encontraron Brechas stk vs dda',
            gapsStk: result?.recordset
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
    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        // Insertar registro en tabla de procesos.
        let resultProcess = await ProcessModel.createProcess(headerProcess);
        let log = {
             proclProcId:resultProcess.procId
            ,proclLog : `Gap Calculation ${headerProcess.procCode} started at: ${new Date()} with procStock: ${headerProcess.procStock}, procDemand: ${headerProcess.procDemand}, procStandard: ${headerProcess.procStandard}`
        }
        //crea registro de log
        let resultLogStart = await ProcessLogModel.createProcessLog(log);

        //ejecuta package p01_run_brecha_bib con los parametros de proceso de demanda, stock y standard
        
        const result = await pool
                            .request()
                            .input("procId",       sql.BigInt      , resultProcess.procId )                            
                            .input("procCode",     sql.VarChar(50) , headerProcess.procCode )
                            .input("procPurcCode", sql.VarChar(6)  , headerProcess.procPurcCode )
                            .input("procStock",    sql.BigInt      , headerProcess.procStock )
                            .input("procDemand",   sql.BigInt      , headerProcess.procDemand )
                            .input("procStandard", sql.BigInt      , headerProcess.procStandard )
                            .execute('p01_run_brecha_bib');

  
        transaction.commit();
       // console.log(result);
        respuesta = {
            type: 'ok',
            status: 200,
            message: {status:"Brecha Calculation Succes",
                      //rows:result.rowsAffected,
                      //procId:resultProcess.procId,
                      procCode:headerProcess.procCode},
        };    
        
        log = {
            proclProcId:resultProcess.procId
           ,proclLog : `Gap Calculation Success:${headerProcess.procCode} ${JSON.stringify(respuesta.message)} at: ${new Date()} with procStock: ${headerProcess.procStock}, procDemand: ${headerProcess.procDemand}, procStandard: ${headerProcess.procStandard}`
       }
       let resultLogSuccess = await ProcessLogModel.createProcessLog(log);           

        //});
    } catch (error) {
        transaction.rollback();
        respuesta = {
            type: 'error',
            status: 400,
            message: error.message,
        };

        log = {
            proclProcId:resultProcess.procId
           ,proclLog : `Gap Calculation ${headerProcess.procCode} error at: ${new Date()} with procStock: ${headerProcess.procStock}, procDemand: ${headerProcess.procDemand}, procStandard: ${headerProcess.procStandard}`
       }
        let resultProcessEnd = await ProcessLogModel.createProcessLog(log);            
    };

    return respuesta;
};
module.exports.gapCalculation = gapCalculation;

const getAllGapPeriodsDda = async() => {

    let respuesta;
    try {
        const sqlDemandPeriods = `
        SELECT DISTINCT 
             [gapr_academic_year]            AS gaprAcademicYear
            ,[gapr_academic_period]          AS gaprAcademicPeriod
            ,CONCAT([gapr_academic_year] , '-' , [gapr_academic_period]) AS gaprDemandPeriod
        FROM [dbo].[tbl_gaps_dda_vs_stock]
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlDemandPeriods);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Periodos de la Brecha dda encontrados' : 'No se encontraron Periodos de la Brecha dda',
            gapPeriodsDda: result?.recordset
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
             [gapr_academic_year]            AS gaprAcademicYear
            ,[gapr_academic_period]          AS gaprAcademicPeriod
            ,CONCAT([gapr_academic_year] , '-' , [gapr_academic_period]) AS gaprDemandPeriod
        FROM [dbo].[tbl_gaps_stock_vs_dda]
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlStkPeriods);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Periodos de la Brecha stk encontrados' : 'No se encontraron Periodos de la Brecha stk',
            gapPeriodsStk: result?.recordset
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




