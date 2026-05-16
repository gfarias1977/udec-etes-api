const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
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
            ,t1.gaps_id                     AS  gapsStdcId                       
            ,t1.gaps_proc_id				AS 	gapsStdcProcId					
            ,t1.gaps_proc_code				AS 	gapsStdcProcCode				
            ,t1.gaps_stdc_bu_code			AS 	gapsStdcBuCode				
            ,t3.bu_name						AS 	gapsStdcBuName						
            ,t1.gaps_stdc_org_code			AS 	gapsStdcOrgCode			
            ,t4.org_description				AS 	gapsStdcOrgDescription				
            ,t1.gaps_stdc_std_code			AS 	gapsStdcStdCode			
            ,t1.gaps_stdc_std_version		AS 	gapsStdcStdVersion			
            ,t5.std_name					AS 	gapsStdcStdName						
            ,t1.gaps_stdc_cours_code		AS 	gapsStdcCoursCode			
            ,t6.cours_description			AS 	gapsStdcCoursDescription				
            ,t1.gaps_stdc_rlay_code			AS 	gapsStdcRlayCode			
            ,t7.rlay_description			AS 	gapsStdcRlayDescription				
            ,t1.gaps_stdc_purc_code			AS 	gapsStdcPurcCode			
            ,t8.purc_name					AS 	gapsStdcPurcName						
            ,t1.gaps_stdc_item_code			AS 	gapsStdcItemCode			
            ,t9.item_name					AS 	gapsStdcItemName						
            ,t1.gaps_stdc_performance		AS 	gapsStdcPerformance			
            ,t1.gaps_stdc_renewal_cicle		AS 	gapsStdcRenewalCicle		
            ,t1.gaps_stdc_maintenance_cicle	AS 	gapsStdcMaintenanceCicle	
            ,t1.gaps_stdc_observations		AS 	gapsStdcObservations		
            ,t1.gaps_stdc_detail			AS 	gapsStdcDetail				
            ,t1.gaps_stdc_status			AS 	gapsStdcStatus				
        FROM dbo.tbl_gaps_source_standard t1
        LEFT JOIN dbo.tbl_process        t2 ON t2.proc_id        = t1.gaps_proc_id
        LEFT JOIN dbo.tbl_business_units t3 ON t3.bu_code        = t1.gaps_stdc_bu_code
        LEFT JOIN dbo.tbl_organizations  t4 ON t4.org_code       = t1.gaps_stdc_org_code
        LEFT JOIN dbo.tbl_standards      t5 ON t5.std_code       = t1.gaps_stdc_std_code 
                                        and t5.std_version       = t1.gaps_stdc_std_version
                                        and t5.std_org_code      = t1.gaps_stdc_org_code
                                        and t5.std_purc_code     = t1.gaps_stdc_purc_code
        LEFT JOIN dbo.tbl_courses        t6 ON t6.cours_code     = t1.gaps_stdc_cours_code and t6.cours_org_code = t1.gaps_stdc_org_code
        LEFT JOIN dbo.tbl_rooms_layout   t7 ON t7.rlay_code      = t1.gaps_stdc_rlay_code
        LEFT JOIN dbo.tbl_purchase_areas t8 ON t8.purc_code      = t1.gaps_stdc_purc_code
        LEFT JOIN dbo.tbl_items          t9 ON t9.item_code      = t1.gaps_stdc_item_code
                                        and t9.item_purc_code = t1.gaps_stdc_purc_code
        WHERE 
                t1.gaps_proc_id            = @gapsProcId
            and t1.gaps_proc_code          = COALESCE(@gapsProcCode     , t1.gaps_proc_code          )
            and t1.gaps_stdc_bu_code       = COALESCE(@gapsBuCode       , t1.gaps_stdc_bu_code       )	
            and t1.gaps_stdc_org_code	   = COALESCE(@gapsOrgCode		, t1.gaps_stdc_org_code	     )	
            and t1.gaps_stdc_std_code	   = COALESCE(@gapsStdCode		, t1.gaps_stdc_std_code	     )	
            and t1.gaps_stdc_std_version   = COALESCE(@gapsStdVersion	, t1.gaps_stdc_std_version   )	
            and t1.gaps_stdc_cours_code	   = COALESCE(@gapsCoursCode	, t1.gaps_stdc_cours_code    )	
            and t1.gaps_stdc_rlay_code	   = COALESCE(@gapsRlayCode	    , t1.gaps_stdc_rlay_code     )	
            and t1.gaps_stdc_purc_code	   = COALESCE(@gapsPurcCode	    , t1.gaps_stdc_purc_code     )	
            and t1.gaps_stdc_item_code	   = COALESCE(@gapsItemCode	    , t1.gaps_stdc_item_code     )		
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('gapsProcId',         sql.BigInt, gapsProcId)        
            .input('gapsProcCode',       sql.VarChar,gapsProcCode)           
            .input('gapsBuCode',         sql.VarChar,gapsBuCode)        
            .input('gapsOrgCode',        sql.VarChar,gapsOrgCode)   	
            .input('gapsStdCode',        sql.VarChar,gapsStdCode)   	
            .input('gapsStdVersion',     sql.Int,    gapsStdVersion)
            .input('gapsCoursCode',      sql.VarChar,gapsCoursCode) 
            .input('gapsRlayCode',       sql.VarChar,gapsRlayCode)  	 
            .input('gapsPurcCode',       sql.VarChar,gapsPurcCode)  	 
            .input('gapsItemCode',       sql.BigInt, gapsItemCode)  
            .query(sqlGetAllGapSourceStandard);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Fuente de Standard encontradas' : 'No se encontraron Fuente de Standard',
            gapsSourceStandard: result?.recordset
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
        FROM [dbo].[tbl_gaps_source_standard]
        WHERE gaps_stdc_item_code IS NOT NULL
        AND gaps_stdc_status = 'S'
      
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(sqlGetAllGapSourceStandard);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Fuente de Standard encontradas' : 'No se encontraron Fuente de Standard',
            gapsSourceStandard: result?.recordset
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
    try {

        const pool = await poolPromise;
        let table = new sql.Table('tbl_gaps_source_standard');
        table.create = true;

        //table.columns.add('gaps_id'                     , sql.BigInt,       { nullable: false });
        table.columns.add('gaps_proc_id'                , sql.BigInt,       { nullable: false });
        table.columns.add('gaps_proc_code'              , sql.VarChar(150), { nullable: false });
        table.columns.add('gaps_stdc_bu_code'           , sql.VarChar(10),  { nullable: false });
        table.columns.add('gaps_stdc_org_code'          , sql.VarChar(10),  { nullable: false });
        table.columns.add('gaps_stdc_std_code'          , sql.VarChar(10),  { nullable: false });
        table.columns.add('gaps_stdc_std_version'       , sql.Int,          { nullable: false });
        table.columns.add('gaps_stdc_cours_code'        , sql.VarChar(10),  { nullable: false });
        table.columns.add('gaps_stdc_rlay_code'         , sql.VarChar(10),  { nullable: false });
        table.columns.add('gaps_stdc_purc_code'         , sql.VarChar(6),   { nullable: false });
        table.columns.add('gaps_stdc_item_code'         , sql.BigInt,       { nullable: false });
        table.columns.add('gaps_stdc_performance'       , sql.Decimal(9,3), { nullable: false });
        table.columns.add('gaps_stdc_renewal_cicle'     , sql.Decimal(9,3), { nullable: false });
        table.columns.add('gaps_stdc_maintenance_cicle' , sql.Decimal(9,3), { nullable: false });
        table.columns.add('gaps_stdc_observations'      , sql.VarChar(MAX), { nullable: false });
        table.columns.add('gaps_stdc_detail'            , sql.VarChar(MAX), { nullable: false });
        table.columns.add('gaps_stdc_status'            , sql.VarChar(1),   { nullable: false });

        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        // Insertar registro en tabla de procesos.
        
        const resultProcess    = await ProcessModel.createProcess(headerProcess);
        let log = {
             proclProcId:resultProcess.procId
            ,proclLog : "Standard Bulk Load Started at: " + new Date()
        }
        let resultProcessLog = await ProcessLogModel.createProcessLog(log);

        if (!resultProcess || resultProcess.type === 'error') {
            log = {
                proclProcId:resultProcess.procId
               ,proclLog : "Standard Bulk Load Error:" + resultProcess.message + " at:" + new Date()
           }
            resultProcessLog = await ProcessLogModel.createProcessLog(log);            
            throw new HttpException(500, 'Error interno del servidor');

        };

        const data  = await getAll();
        if (!data || data.type === 'error') {
            log = {
                proclProcId:resultProcess.procId
               ,proclLog : "Standard Bulk Load Error:" + resultProcess.message + " at:" + new Date()
           }
            resultProcessLog = await ProcessLogModel.createProcessLog(log);            
            throw new HttpException(500, 'Error interno del servidor');

        };

        for (let i = 0; i < data.gapsSourceStandard.length; i++) {
            table.rows.add(
                // 0,
                resultProcess.procId,
                headerProcess.procCode,
                data.gapsSourceStandard[i].gaps_stdc_bu_code,
                data.gapsSourceStandard[i].gaps_stdc_org_code,
                data.gapsSourceStandard[i].gaps_stdc_std_code,
                data.gapsSourceStandard[i].gaps_stdc_std_version,
                data.gapsSourceStandard[i].gaps_stdc_cours_code,
                data.gapsSourceStandard[i].gaps_stdc_rlay_code,
                data.gapsSourceStandard[i].gaps_stdc_purc_code,
                data.gapsSourceStandard[i].gaps_stdc_item_code,
                data.gapsSourceStandard[i].gaps_stdc_performance,
                data.gapsSourceStandard[i].gaps_stdc_renewal_cicle,
                data.gapsSourceStandard[i].gaps_stdc_maintenance_cicle,
                data.gapsSourceStandard[i].gaps_stdc_observations,
                data.gapsSourceStandard[i].gaps_stdc_detail,
                data.gapsSourceStandard[i].gaps_stdc_status
            );
        }

        // Bulk Insert de Standard
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
                                message: {status:"Standard Load Success",
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
            message: {status:"Standard Load Success",
                      rows:result.rowsAffected,
                      procId:resultProcess.procId,
                      procCode:headerProcess.procCode},
        };    
        
        log = {
            proclProcId:resultProcess.procId
           ,proclLog : "Standard Bulk Load Succes:" + JSON.stringify(respuesta.message) + " at:" + new Date()
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
           ,proclLog : "Standard Bulk Load Error: " + error.message + " at:" + new Date()
       }
        resultProcessLog = await ProcessLogModel.createProcessLog(log);            
    };

    return respuesta;
};
module.exports.bulkLoadStandard = bulkLoadStandard;


const deleteGapSourceStandard = async (procId) => {

    try {

        const sqlDeleteGapSourceStandard = `
        DELETE 
          FROM tbl_gaps_source_standard
         WHERE gaps_proc_id = @procId
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('procId', sql.Numeric, procId)
            .query(sqlDeleteGapSourceStandard);

        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteGapSourceStandard = deleteGapSourceStandard;
