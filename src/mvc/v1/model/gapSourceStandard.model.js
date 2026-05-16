
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');
const ProcessModel = require('./process.model');
const ProcessLogModel = require('./processLog.model');


const getAllGapSourceStandardByParameters = async (
    gapsProcId,
    gapsProcCode,      
    gapsBuCode,    
    gapsOrgCode,	
    gapsStdCode,	
    gapsStdVersion,
    gapsCoursCode,
    gapsRlayCode,	 
    gapsPurcCode,	 
    gapsItemCode	 
    
) => {

    let respuesta;
    try {
        const sqlGetAllGapSourceStandard = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.gaps_id ASC) AS id
            ,t1.gaps_id                     AS "gapsStdcId"                       
            ,t1.gaps_proc_id				AS "gapsStdcProcId"					
            ,t1.gaps_proc_code				AS "gapsStdcProcCode"				
            ,t1.gaps_stdc_bu_code			AS "gapsStdcBuCode"				
            ,t3.bu_name						AS "gapsStdcBuName"						
            ,t1.gaps_stdc_org_code			AS "gapsStdcOrgCode"			
            ,t4.org_description				AS "gapsStdcOrgDescription"				
            ,t1.gaps_stdc_std_code			AS "gapsStdcStdCode"			
            ,t1.gaps_stdc_std_version		AS "gapsStdcStdVersion"			
            ,t5.std_name					AS "gapsStdcStdName"						
            ,t1.gaps_stdc_cours_code		AS "gapsStdcCoursCode"			
            ,t6.cours_description			AS "gapsStdcCoursDescription"				
            ,t1.gaps_stdc_rlay_code			AS "gapsStdcRlayCode"			
            ,t7.rlay_description			AS "gapsStdcRlayDescription"				
            ,t1.gaps_stdc_purc_code			AS "gapsStdcPurcCode"			
            ,t8.purc_name					AS "gapsStdcPurcName"						
            ,t1.gaps_stdc_item_code			AS "gapsStdcItemCode"			
            ,t9.item_name					AS "gapsStdcItemName"						
            ,t1.gaps_stdc_performance		AS "gapsStdcPerformance"			
            ,t1.gaps_stdc_renewal_cicle		AS "gapsStdcRenewalCicle"		
            ,t1.gaps_stdc_maintenance_cicle	AS "gapsStdcMaintenanceCicle"	
            ,t1.gaps_stdc_observations		AS "gapsStdcObservations"		
            ,t1.gaps_stdc_detail			AS "gapsStdcDetail"				
            ,t1.gaps_stdc_status			AS "gapsStdcStatus"				
        FROM tbl_gaps_source_standard t1
        LEFT JOIN tbl_process        t2 ON t2.proc_id        = t1.gaps_proc_id
        LEFT JOIN tbl_business_units t3 ON t3.bu_code        = t1.gaps_stdc_bu_code
        LEFT JOIN tbl_organizations  t4 ON t4.org_code       = t1.gaps_stdc_org_code
        LEFT JOIN tbl_standards      t5 ON t5.std_code       = t1.gaps_stdc_std_code 
                                        and t5.std_version       = t1.gaps_stdc_std_version
                                        and t5.std_org_code      = t1.gaps_stdc_org_code
                                        and t5.std_purc_code     = t1.gaps_stdc_purc_code
        LEFT JOIN tbl_courses        t6 ON t6.cours_code     = t1.gaps_stdc_cours_code and t6.cours_org_code = t1.gaps_stdc_org_code
        LEFT JOIN tbl_rooms_layout   t7 ON t7.rlay_code      = t1.gaps_stdc_rlay_code
        LEFT JOIN tbl_purchase_areas t8 ON t8.purc_code      = t1.gaps_stdc_purc_code
        LEFT JOIN tbl_items          t9 ON t9.item_code      = t1.gaps_stdc_item_code
                                        and t9.item_purc_code = t1.gaps_stdc_purc_code
        WHERE 
                t1.gaps_proc_id            = $1
            and t1.gaps_proc_code          = COALESCE($2     , t1.gaps_proc_code          )
            and t1.gaps_stdc_bu_code       = COALESCE($3       , t1.gaps_stdc_bu_code       )	
            and t1.gaps_stdc_org_code	   = COALESCE($4		, t1.gaps_stdc_org_code	     )	
            and t1.gaps_stdc_std_code	   = COALESCE($5		, t1.gaps_stdc_std_code	     )	
            and t1.gaps_stdc_std_version   = COALESCE($6	, t1.gaps_stdc_std_version   )	
            and t1.gaps_stdc_cours_code	   = COALESCE($7	, t1.gaps_stdc_cours_code    )	
            and t1.gaps_stdc_rlay_code	   = COALESCE($8	    , t1.gaps_stdc_rlay_code     )	
            and t1.gaps_stdc_purc_code	   = COALESCE($9	    , t1.gaps_stdc_purc_code     )	
            and t1.gaps_stdc_item_code	   = COALESCE($10	    , t1.gaps_stdc_item_code     )		
        `;

        const result = await pool.query(sqlGetAllGapSourceStandard, [gapsProcId, gapsProcCode, gapsBuCode, gapsOrgCode, gapsStdCode, gapsStdVersion, gapsCoursCode, gapsRlayCode, gapsPurcCode, gapsItemCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Fuente de Standard encontradas' : 'No se encontraron Fuente de Standard',
            gapsSourceStandard: result?.rows
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
module.exports.getAllGapSourceStandardByParameters = getAllGapSourceStandardByParameters;

const getAll = async () => {

    let respuesta;
    try {
        const sqlGetAllGapSourceStandard = `
        SELECT [gaps_stdc_bu_code]
            ,[gaps_stdc_org_code]
            ,[gaps_stdc_std_code]
            ,[gaps_stdc_std_version]
            ,[gaps_stdc_cours_code]
            ,[gaps_stdc_rlay_code]
            ,[gaps_stdc_purc_code]
            ,[gaps_stdc_item_code]
            ,coalesce([gaps_stdc_performance], 0) as [gaps_stdc_performance]
            ,coalesce([gaps_stdc_renewal_cicle], 0) as [gaps_stdc_renewal_cicle]
            ,coalesce([gaps_stdc_maintenance_cicle], 0) as [gaps_stdc_maintenance_cicle]
            ,coalesce([gaps_stdc_observations], '') as [gaps_stdc_observations]
            ,coalesce([gaps_stdc_detail], '') as [gaps_stdc_detail]
            ,coalesce([gaps_stdc_status], '') as [gaps_stdc_status]
        FROM tbl_gaps_source_standard
        WHERE gaps_stdc_item_code IS NOT NULL
        AND gaps_stdc_status = 'S'
      
        `;

        const result = await pool.query(sqlGetAllGapSourceStandard);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Fuente de Standard encontradas' : 'No se encontraron Fuente de Standard',
            gapsSourceStandard: result?.rows
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
module.exports.getAll = getAll;


const bulkLoadStandard = async ({
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
        , procProctId: 3
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
            ,proclLog: "Standard Bulk Load Started at: " + new Date()
        };
        let resultProcessLog = await ProcessLogModel.createProcessLog(log);

        if (!resultProcess || resultProcess.type === 'error') {
            log = {
                proclProcId: resultProcess.procId
               ,proclLog: "Standard Bulk Load Error:" + resultProcess.message + " at:" + new Date()
            };
            resultProcessLog = await ProcessLogModel.createProcessLog(log);
            throw new HttpException(500, 'Error interno del servidor');
        };

        const data = await getAll();
        if (!data || data.type === 'error') {
            log = {
                proclProcId: resultProcess.procId
               ,proclLog: "Standard Bulk Load Error:" + resultProcess.message + " at:" + new Date()
            };
            resultProcessLog = await ProcessLogModel.createProcessLog(log);
            throw new HttpException(500, 'Error interno del servidor');
        };

        // Bulk Insert de Standard usando unnest
        const sqlBulkInsert = `
            INSERT INTO tbl_gaps_source_standard (
                gaps_proc_id, gaps_proc_code,
                gaps_stdc_bu_code, gaps_stdc_org_code, gaps_stdc_std_code, gaps_stdc_std_version,
                gaps_stdc_cours_code, gaps_stdc_rlay_code, gaps_stdc_purc_code, gaps_stdc_item_code,
                gaps_stdc_performance, gaps_stdc_renewal_cicle, gaps_stdc_maintenance_cicle,
                gaps_stdc_observations, gaps_stdc_detail, gaps_stdc_status
            )
            SELECT * FROM unnest(
                $1::bigint[], $2::text[],
                $3::text[], $4::text[], $5::text[], $6::int[],
                $7::text[], $8::text[], $9::text[], $10::bigint[],
                $11::numeric[], $12::numeric[], $13::numeric[],
                $14::text[], $15::text[], $16::text[]
            )
        `;
        const rows = data.gapsSourceStandard;
        const cols = {
            gaps_proc_id:                rows.map(() => resultProcess.procId),
            gaps_proc_code:              rows.map(() => headerProcess.procCode),
            gaps_stdc_bu_code:           rows.map(r => r.gaps_stdc_bu_code),
            gaps_stdc_org_code:          rows.map(r => r.gaps_stdc_org_code),
            gaps_stdc_std_code:          rows.map(r => r.gaps_stdc_std_code),
            gaps_stdc_std_version:       rows.map(r => r.gaps_stdc_std_version),
            gaps_stdc_cours_code:        rows.map(r => r.gaps_stdc_cours_code),
            gaps_stdc_rlay_code:         rows.map(r => r.gaps_stdc_rlay_code),
            gaps_stdc_purc_code:         rows.map(r => r.gaps_stdc_purc_code),
            gaps_stdc_item_code:         rows.map(r => r.gaps_stdc_item_code),
            gaps_stdc_performance:       rows.map(r => r.gaps_stdc_performance),
            gaps_stdc_renewal_cicle:     rows.map(r => r.gaps_stdc_renewal_cicle),
            gaps_stdc_maintenance_cicle: rows.map(r => r.gaps_stdc_maintenance_cicle),
            gaps_stdc_observations:      rows.map(r => r.gaps_stdc_observations),
            gaps_stdc_detail:            rows.map(r => r.gaps_stdc_detail),
            gaps_stdc_status:            rows.map(r => r.gaps_stdc_status),
        };
        const result = await client.query(sqlBulkInsert, Object.values(cols));

        await client.query('COMMIT');
        console.log(result);
        respuesta = {
            type: 'ok',
            status: 200,
            message: {
                status: "Standard Load Success",
                rows: result.rowCount,
                procId: resultProcess.procId,
                procCode: headerProcess.procCode,
            },
        };

        log = {
            proclProcId: resultProcess.procId
           ,proclLog: "Standard Bulk Load Succes:" + JSON.stringify(respuesta.message) + " at:" + new Date()
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
           ,proclLog: "Standard Bulk Load Error: " + error.message + " at:" + new Date()
        };
        resultProcessLog = await ProcessLogModel.createProcessLog(log);
    } finally {
        client.release();
    };

    return respuesta;
};
module.exports.bulkLoadStandard = bulkLoadStandard;


const deleteGapSourceStandard = async (procId) => {

    try {

        const sqlDeleteGapSourceStandard = `
        DELETE 
          FROM tbl_gaps_source_standard
         WHERE gaps_proc_id = $1
        `;

        const result = await pool.query(sqlDeleteGapSourceStandard, [procId]);

        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteGapSourceStandard = deleteGapSourceStandard;
