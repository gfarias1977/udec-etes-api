const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');
const ProcessModel = require('./process.model');
const ProcessLogModel = require('./processLog.model');


const getAllGapSourceDemandByParameters = async (
    gapdProcId               ,
    gapdProcCode             ,
    gapdStdcAcademicYear     ,
    gapdStdcAcademicPeriod   ,
    gapdOrgCode              ,
    gapdCampCode             ,      
    gapdSchoCode             ,        
    gapdCoursCode            ,      
    gapdWktCode              ,       
    gapdActCode              ,     
    gapdCityCode             
) => {

    let respuesta;
    try {
        const sqlGetAllGapSourceDemand = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.gapd_id ASC) AS id
            ,t1.gapd_id                        AS gapdId                     
            ,t1.gapd_proc_id				   AS gapdProcId				  
            ,t1.gapd_proc_code			       AS gapdProcCode			  
            ,t1.gapd_stdc_year			       AS gapdStdcYear			  
            ,t1.gapd_stdc_version			   AS gapdStdcVersion			  
            ,t1.gapd_stdc_academic_year	       AS gapdStdcAcademicYear	  
            ,t1.gapd_stdc_academic_period	   AS gapdStdcAcademicPeriod	  
            ,t1.gapd_stdc_org_code		       AS gapdStdcOrgCode	
            ,t3.org_description			       AS gapdOrgDescription
            ,t1.gapd_stdc_camp_code		       AS gapdStdcCampCode	
            ,t4.camp_description			   AS gapdCampDescription
            ,t1.gapd_stdc_scho_code		       AS gapdStdcSchoCode	
            ,t6.scho_description               AS gapdschoDescription	
            ,t1.gapd_stdc_cours_code		   AS gapdStdcCoursCode	
            ,t7.cours_description              AS gapdCoursDescription
            ,t1.gapd_stdc_wkt_code		       AS gapdStdcWktCode		  
            ,t1.gapd_stdc_act_code		       AS gapdStdcActCode	
            ,t9.act_name                       AS gapdActName
            ,t1.gapd_stdc_city			       AS gapdStdcCity	
            ,t1.gapd_stdc_students_qty	       AS gapdStdcStudentsQty	  
            ,t1.gapd_stdc_act_code_principal   AS gapdStdcActCodePrincipal
            ,t1.gapd_stdc_course_type		   AS gapdStdcCourseType		  
        FROM dbo.tbl_gaps_source_demand t1
        LEFT JOIN dbo.tbl_process       t2 ON t2.proc_id    = t1.gapd_proc_id
        LEFT JOIN dbo.tbl_organizations t3 ON t3.org_code   = t1.gapd_stdc_org_code
        LEFT JOIN dbo.tbl_campus        t4 ON t4.camp_code  = t1.gapd_stdc_camp_code and t4.camp_org_code = t1.gapd_stdc_org_code
        LEFT JOIN dbo.tbl_cities        t5 ON t5.city_code  = t1.gapd_stdc_city 
        LEFT JOIN dbo.tbl_schools       t6 ON t6.scho_code  = t1.gapd_stdc_scho_code  and t6.scho_org_code  = t1.gapd_stdc_org_code
        LEFT JOIN dbo.tbl_courses       t7 ON t7.cours_code = t1.gapd_stdc_cours_code and t7.cours_org_code = t1.gapd_stdc_org_code
        LEFT JOIN dbo.tbl_work_time     t8 ON t8.wkt_code   = t1.gapd_stdc_wkt_code 
        LEFT JOIN dbo.tbl_activities    t9 ON t9.act_code   = t1.gapd_stdc_act_code        
        WHERE 
                t1.gapd_proc_id              = @gapdProcId
            and t1.gapd_proc_code            = COALESCE(@gapdProcCode             , t1.gapd_proc_code)
            and t1.gapd_stdc_academic_year	 = COALESCE(@gapdStdcAcademicYear     , t1.gapd_stdc_academic_year)		
            and t1.gapd_stdc_academic_period = COALESCE(@gapdStdcAcademicPeriod   , t1.gapd_stdc_academic_period)		 
            and t1.gapd_stdc_org_code        = COALESCE(@gapdOrgCode              , t1.gapd_stdc_org_code)
            and t1.gapd_stdc_camp_code       = COALESCE(@gapdCampCode             , t1.gapd_stdc_camp_code)
            and t1.gapd_stdc_scho_code       = COALESCE(@gapdSchoCode             , t1.gapd_stdc_scho_code)
            and t1.gapd_stdc_cours_code      = COALESCE(@gapdCoursCode            , t1.gapd_stdc_cours_code)
            and t1.gapd_stdc_wkt_code        = COALESCE(@gapdWktCode              , t1.gapd_stdc_wkt_code)
            and t1.gapd_stdc_act_code        = COALESCE(@gapdActCode              , t1.gapd_stdc_act_code)
            and t1.gapd_stdc_city            = COALESCE(@gapdCityCode             , t1.gapd_stdc_city)
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('gapdProcId',               sql.BigInt,  gapdProcId)               
            .input('gapdProcCode',             sql.VarChar, gapdProcCode)           
            .input('gapdStdcAcademicYear',     sql.BigInt,  gapdStdcAcademicYear)     
            .input('gapdStdcAcademicPeriod',   sql.BigInt,  gapdStdcAcademicPeriod)   
            .input('gapdOrgCode',              sql.VarChar, gapdOrgCode)              
            .input('gapdCampCode',             sql.VarChar, gapdCampCode)                   
            .input('gapdSchoCode',             sql.VarChar, gapdSchoCode)                     
            .input('gapdCoursCode',            sql.VarChar, gapdCoursCode)                  
            .input('gapdWktCode',              sql.VarChar, gapdWktCode)                     
            .input('gapdActCode',              sql.VarChar, gapdActCode)                  
            .input('gapdCityCode',             sql.VarChar, gapdCityCode)  
            .query(sqlGetAllGapSourceDemand);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Fuente de Demand encontradas' : 'No se encontraron Fuente de Demand',
            gapsSourceDemand: result?.recordset
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
module.exports.getAllGapSourceDemandByParameters = getAllGapSourceDemandByParameters;

const bulkLoadDemand = async ({
    data, header
}) => {

    let respuesta;
    const todaysDate = new Date();
    const currentYear = todaysDate.getFullYear();
    const currentMonth = todaysDate.getMonth();
    const currentDay = todaysDate.getDay();
    const currentMinutes = todaysDate.getMinutes();

    let headerProcess = {
          procPurcCode: header.proc_purc_code
        , procProctId: 2
        , procScheduledDate: todaysDate
        , procEmailNotification: header.proc_email_notification
        , procCode: currentYear + '' + currentMonth + '' + currentDay + '' + currentMinutes
        , procFile: null
        , procFileUploaded: null
        , procStatus: "P"
        , procStock: null
        , procDemand: null
        , procStandard: null
        , procMsg: header.proc_msg
    }
    try {

        const pool = await poolPromise;
        let table = new sql.Table('tbl_gaps_source_demand');
        table.create = true;

        //table.columns.add('gapd_id'                    , sql.BigInt,       { nullable: false });
        table.columns.add('gapd_proc_id'                 , sql.BigInt,       { nullable: false });
        table.columns.add('gapd_proc_code'               , sql.VarChar(150), { nullable: false });
        table.columns.add('gapd_stdc_year'               , sql.BigInt,       { nullable: false });
        table.columns.add('gapd_stdc_version'            , sql.BigInt,       { nullable: false });
        table.columns.add('gapd_stdc_academic_year'      , sql.BigInt,       { nullable: false });
        table.columns.add('gapd_stdc_academic_period'    , sql.BigInt,       { nullable: false });
        table.columns.add('gapd_stdc_org_code'           , sql.VarChar(10),  { nullable: false });
        table.columns.add('gapd_stdc_camp_code'          , sql.VarChar(4),   { nullable: false });
        table.columns.add('gapd_stdc_scho_code'          , sql.VarChar(6),   { nullable: false });
        table.columns.add('gapd_stdc_cours_code'         , sql.VarChar(10),  { nullable: false });
        table.columns.add('gapd_stdc_wkt_code'           , sql.VarChar(1),   { nullable: false });
        table.columns.add('gapd_stdc_act_code'           , sql.VarChar(3),   { nullable: false });
        table.columns.add('gapd_stdc_students_qty'       , sql.BigInt,       { nullable: false });
        table.columns.add('gapd_stdc_act_code_principal' , sql.VarChar(3),   { nullable: false });
        table.columns.add('gapd_stdc_course_type'        , sql.VarChar(1),   { nullable: false });
        table.columns.add('gapd_stdc_city'               , sql.VarChar(20), { nullable: false });

        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        // Insertar registro en tabla de procesos.
        
        const resultProcess    = await ProcessModel.createProcess(headerProcess);
        let log = {
             proclProcId:resultProcess.procId
            ,proclLog : "Demand Bulk Load Started at: " + new Date()
        }
        let resultProcessLog = await ProcessLogModel.createProcessLog(log);

        if (!resultProcess || resultProcess.type === 'error') {
            log = {
                proclProcId:resultProcess.procId
               ,proclLog : "Demand Bulk Load Error:" + resultProcess.message + " at:" + new Date()
           }
            resultProcessLog = await ProcessLogModel.createProcessLog(log);            
            throw new HttpException(500, 'Error interno del servidor');

        };

        for (let i = 0; i < data.length; i++) {
            table.rows.add(
                // 0,
                resultProcess.procId,
                headerProcess.procCode,
                data[i].gapd_stdc_year,
                data[i].gapd_stdc_version,
                data[i].gapd_stdc_academic_year,
                data[i].gapd_stdc_academic_period,
                data[i].gapd_stdc_org_code,
                data[i].gapd_stdc_camp_code,
                data[i].gapd_stdc_scho_code,
                data[i].gapd_stdc_cours_code,
                data[i].gapd_stdc_wkt_code,
                data[i].gapd_stdc_act_code,
                data[i].gapd_stdc_students_qty,
                data[i].gapd_stdc_act_code_principal,
                data[i].gapd_stdc_course_type,
                data[i].gapd_stdc_city
            );
        }

        // Bulk Insert de Demand
        const request = pool.request();
        /*             request.bulk(table, (err, result) => {
                        if (err) {
                            console.error(err);                    
                            transaction.rollback();
                            return respuesta = {
                                type: 'error',
                                status: 400,
                                message: err.message,
                            };                    
                        } else {
                            console.log('Success!');
                            transaction.commit();
                            console.log(result);
                            //console.log('Transaction committed successfully.');
                            return respuesta = {
                                type: 'ok',
                                status: 200,
                                message: {status:"Demand Load Success",
                                          rows:result.rowsAffected,
                                          procId:resultProcess.procId,
                                          procCode:headerProcess.procCode},
                            };                    
                        }
                        
                    })    */
        const result = await request.bulk(table);
        transaction.commit();
        console.log(result);
        respuesta = {
            type: 'ok',
            status: 200,
            message: {status:"Demand Load Success",
                      rows:result.rowsAffected,
                      procId:resultProcess.procId,
                      procCode:headerProcess.procCode},
        };    
        
        log = {
            proclProcId:resultProcess.procId
           ,proclLog : "Demand Bulk Load Succes:" + JSON.stringify(respuesta.message) + " at:" + new Date()
       }
        resultProcessLog = await ProcessLogModel.createProcessLog(log);           

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
           ,proclLog : "Demand Bulk Load Error: " + error.message + " at:" + new Date()
       }
        resultProcessLog = await ProcessLogModel.createProcessLog(log);            
    };

    return respuesta;
};
module.exports.bulkLoadDemand = bulkLoadDemand;


const deleteGapSourceDemand = async (procId) => {

    try {

        const sqlDeleteGapSourceDemand = `
        DELETE 
          FROM tbl_gaps_source_demand
         WHERE gapd_proc_id = @procId
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('procId', sql.Numeric, procId)
            .query(sqlDeleteGapSourceDemand);

        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};
module.exports.deleteGapSourceDemand = deleteGapSourceDemand;

const getAllDemandPeriods = async() => {

    let respuesta;
    try {
        const sqlDemandPeriods = `
            SELECT DISTINCT 
                [gapd_stdc_academic_year]           AS gapdStdcAcademicYear
                ,[gapd_stdc_academic_period]        AS gapdStdcAcademicPeriod
                ,CONCAT([gapd_stdc_academic_year] , '-' , [gapd_stdc_academic_period]) AS gapdStdcDemandPeriod
            FROM [dbo].[tbl_gaps_source_demand]
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlDemandPeriods);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Periodos de la Demanda encontrados' : 'No se encontraron Periodos de la Demanda',
            demandPeriods: result?.recordset
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
module.exports.getAllDemandPeriods = getAllDemandPeriods;



