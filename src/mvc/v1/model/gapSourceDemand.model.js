
const { pool } = require('../../../services/database');
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
            ,t1.gapd_id                        AS "gapdId"                     
            ,t1.gapd_proc_id				   AS "gapdProcId"				  
            ,t1.gapd_proc_code			       AS "gapdProcCode"			  
            ,t1.gapd_stdc_year			       AS "gapdStdcYear"			  
            ,t1.gapd_stdc_version			   AS "gapdStdcVersion"			  
            ,t1.gapd_stdc_academic_year	       AS "gapdStdcAcademicYear"	  
            ,t1.gapd_stdc_academic_period	   AS "gapdStdcAcademicPeriod"	  
            ,t1.gapd_stdc_org_code		       AS "gapdStdcOrgCode"	
            ,t3.org_description			       AS "gapdOrgDescription"
            ,t1.gapd_stdc_camp_code		       AS "gapdStdcCampCode"	
            ,t4.camp_description			   AS "gapdCampDescription"
            ,t1.gapd_stdc_scho_code		       AS "gapdStdcSchoCode"	
            ,t6.scho_description               AS "gapdschoDescription"	
            ,t1.gapd_stdc_cours_code		   AS "gapdStdcCoursCode"	
            ,t7.cours_description              AS "gapdCoursDescription"
            ,t1.gapd_stdc_wkt_code		       AS "gapdStdcWktCode"		  
            ,t1.gapd_stdc_act_code		       AS "gapdStdcActCode"	
            ,t9.act_name                       AS "gapdActName"
            ,t1.gapd_stdc_city			       AS "gapdStdcCity"	
            ,t1.gapd_stdc_students_qty	       AS "gapdStdcStudentsQty"	  
            ,t1.gapd_stdc_act_code_principal   AS "gapdStdcActCodePrincipal"
            ,t1.gapd_stdc_course_type		   AS "gapdStdcCourseType"		  
        FROM tbl_gaps_source_demand t1
        LEFT JOIN tbl_process       t2 ON t2.proc_id    = t1.gapd_proc_id
        LEFT JOIN tbl_organizations t3 ON t3.org_code   = t1.gapd_stdc_org_code
        LEFT JOIN tbl_campus        t4 ON t4.camp_code  = t1.gapd_stdc_camp_code and t4.camp_org_code = t1.gapd_stdc_org_code
        LEFT JOIN tbl_cities        t5 ON t5.city_code  = t1.gapd_stdc_city 
        LEFT JOIN tbl_schools       t6 ON t6.scho_code  = t1.gapd_stdc_scho_code  and t6.scho_org_code  = t1.gapd_stdc_org_code
        LEFT JOIN tbl_courses       t7 ON t7.cours_code = t1.gapd_stdc_cours_code and t7.cours_org_code = t1.gapd_stdc_org_code
        LEFT JOIN tbl_work_time     t8 ON t8.wkt_code   = t1.gapd_stdc_wkt_code 
        LEFT JOIN tbl_activities    t9 ON t9.act_code   = t1.gapd_stdc_act_code        
        WHERE 
                t1.gapd_proc_id              = $1
            and t1.gapd_proc_code            = COALESCE($2             , t1.gapd_proc_code)
            and t1.gapd_stdc_academic_year	 = COALESCE($3     , t1.gapd_stdc_academic_year)		
            and t1.gapd_stdc_academic_period = COALESCE($4   , t1.gapd_stdc_academic_period)		 
            and t1.gapd_stdc_org_code        = COALESCE($5              , t1.gapd_stdc_org_code)
            and t1.gapd_stdc_camp_code       = COALESCE($6             , t1.gapd_stdc_camp_code)
            and t1.gapd_stdc_scho_code       = COALESCE($7             , t1.gapd_stdc_scho_code)
            and t1.gapd_stdc_cours_code      = COALESCE($8            , t1.gapd_stdc_cours_code)
            and t1.gapd_stdc_wkt_code        = COALESCE($9              , t1.gapd_stdc_wkt_code)
            and t1.gapd_stdc_act_code        = COALESCE($10              , t1.gapd_stdc_act_code)
            and t1.gapd_stdc_city            = COALESCE($11             , t1.gapd_stdc_city)
        `;

        const result = await pool.query(sqlGetAllGapSourceDemand, [gapdProcId, gapdProcCode, gapdStdcAcademicYear, gapdStdcAcademicPeriod, gapdOrgCode, gapdCampCode, gapdSchoCode, gapdCoursCode, gapdWktCode, gapdActCode, gapdCityCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Fuente de Demand encontradas' : 'No se encontraron Fuente de Demand',
            gapsSourceDemand: result?.rows
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insertar registro en tabla de procesos.
        const resultProcess = await ProcessModel.createProcess(headerProcess);
        let log = {
             proclProcId: resultProcess.procId
            ,proclLog: "Demand Bulk Load Started at: " + new Date()
        };
        let resultProcessLog = await ProcessLogModel.createProcessLog(log);

        if (!resultProcess || resultProcess.type === 'error') {
            log = {
                proclProcId: resultProcess.procId
               ,proclLog: "Demand Bulk Load Error:" + resultProcess.message + " at:" + new Date()
            };
            resultProcessLog = await ProcessLogModel.createProcessLog(log);
            throw new HttpException(500, 'Error interno del servidor');
        };

        // Bulk Insert de Demand usando unnest
        const sqlBulkInsert = `
            INSERT INTO tbl_gaps_source_demand (
                gapd_proc_id, gapd_proc_code,
                gapd_stdc_year, gapd_stdc_version, gapd_stdc_academic_year, gapd_stdc_academic_period,
                gapd_stdc_org_code, gapd_stdc_camp_code, gapd_stdc_scho_code, gapd_stdc_cours_code,
                gapd_stdc_wkt_code, gapd_stdc_act_code, gapd_stdc_students_qty,
                gapd_stdc_act_code_principal, gapd_stdc_course_type, gapd_stdc_city
            )
            SELECT * FROM unnest(
                $1::bigint[], $2::text[],
                $3::bigint[], $4::bigint[], $5::bigint[], $6::bigint[],
                $7::text[], $8::text[], $9::text[], $10::text[],
                $11::text[], $12::text[], $13::bigint[],
                $14::text[], $15::text[], $16::text[]
            )
        `;
        const cols = {
            gapd_proc_id:                 data.map(() => resultProcess.procId),
            gapd_proc_code:               data.map(() => headerProcess.procCode),
            gapd_stdc_year:               data.map(r => r.gapd_stdc_year),
            gapd_stdc_version:            data.map(r => r.gapd_stdc_version),
            gapd_stdc_academic_year:      data.map(r => r.gapd_stdc_academic_year),
            gapd_stdc_academic_period:    data.map(r => r.gapd_stdc_academic_period),
            gapd_stdc_org_code:           data.map(r => r.gapd_stdc_org_code),
            gapd_stdc_camp_code:          data.map(r => r.gapd_stdc_camp_code),
            gapd_stdc_scho_code:          data.map(r => r.gapd_stdc_scho_code),
            gapd_stdc_cours_code:         data.map(r => r.gapd_stdc_cours_code),
            gapd_stdc_wkt_code:           data.map(r => r.gapd_stdc_wkt_code),
            gapd_stdc_act_code:           data.map(r => r.gapd_stdc_act_code),
            gapd_stdc_students_qty:       data.map(r => r.gapd_stdc_students_qty),
            gapd_stdc_act_code_principal: data.map(r => r.gapd_stdc_act_code_principal),
            gapd_stdc_course_type:        data.map(r => r.gapd_stdc_course_type),
            gapd_stdc_city:               data.map(r => r.gapd_stdc_city),
        };
        const result = await client.query(sqlBulkInsert, Object.values(cols));

        await client.query('COMMIT');
        console.log(result);
        respuesta = {
            type: 'ok',
            status: 200,
            message: {
                status: "Demand Load Success",
                rows: result.rowCount,
                procId: resultProcess.procId,
                procCode: headerProcess.procCode,
            },
        };

        log = {
            proclProcId: resultProcess.procId
           ,proclLog: "Demand Bulk Load Succes:" + JSON.stringify(respuesta.message) + " at:" + new Date()
        };
        resultProcessLog = await ProcessLogModel.createProcessLog(log);

    } catch (error) {
        await client.query('ROLLBACK');
        respuesta = {
            type: 'error',
            status: 400,
            message: error.message,
        };

        log = {
            proclProcId: resultProcess ? resultProcess.procId : null
           ,proclLog: "Demand Bulk Load Error: " + error.message + " at:" + new Date()
        };
        resultProcessLog = await ProcessLogModel.createProcessLog(log);
    } finally {
        client.release();
    };

    return respuesta;
};
module.exports.bulkLoadDemand = bulkLoadDemand;


const deleteGapSourceDemand = async (procId) => {

    try {

        const sqlDeleteGapSourceDemand = `
        DELETE 
          FROM tbl_gaps_source_demand
         WHERE gapd_proc_id = $1
        `;

        const result = await pool.query(sqlDeleteGapSourceDemand, [procId]);

        const affectedRows = result.rowCount;

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
                [gapd_stdc_academic_year]           AS "gapdStdcAcademicYear"
                ,[gapd_stdc_academic_period]        AS "gapdStdcAcademicPeriod"
                ,CONCAT([gapd_stdc_academic_year] , '-' , [gapd_stdc_academic_period]) AS "gapdStdcDemandPeriod"
            FROM tbl_gaps_source_demand
        `;

        const result = await pool.query(sqlDemandPeriods);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Periodos de la Demanda encontrados' : 'No se encontraron Periodos de la Demanda',
            demandPeriods: result?.rows
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



