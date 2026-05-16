const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');
const ProcessModel = require('../model/process.model');
const ProcessLogModel = require('../model/processLog.model');


const getAllGapSourceStockByParameters = async (
    gapstPurcCode,       
    gapstProcId,     
    gapstProcCode,   
    gapstOrgCode,    
    gapstCampCode,   
    gapstCityCode,   
    gapstItemId,  
    gapstLibraryId,   
    gapstVolumen,    
    gapstFormatType,
    gapstItemCode
) => {

    let respuesta;
    try {
        const sqlGetAllGapSourceStock = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.gapst_id ASC) AS id
              ,t1.gapst_id                      AS gapstId
              ,t1.gapst_proc_id       		    AS gapstProcId
              ,t1.gapst_proc_code			    AS gapstProcCode
              ,t1.gapst_org_code			    AS gapstOrgCode
              ,t3.org_description			    AS gapstOrgDescription
              ,t1.gapst_camp_code			    AS gapstCampCode
              ,t4.camp_description			    AS gapstCampDescription
              ,t1.gapst_camp_library		    AS gapstCampLibrary
              ,t1.gapst_camp_sub_library	    AS gapstCampSubLibrary
              ,t1.gapst_city				    AS gapstCity
              ,t1.gapst_item_code			    AS gapstItemCode
              ,coalesce(t6.item_description,'') AS gapstItemDescription
              ,coalesce(t6.item_value_01,'')    AS gapstItemTitulo
              ,coalesce(t6.item_value_02,'')    AS gapstItemAutor
              ,coalesce(t6.item_value_03,'')    AS gapstItemEditorial
              ,t1.gapst_library_id			    AS gapstLibraryId
              ,t1.gapst_item_id				    AS gapstItemId
              ,t1.gapst_format				    AS gapstFormat
              ,t1.gapst_format_type			    AS gapstFormatType
              ,t1.gapst_volumen				    AS gapstVolumen
          FROM dbo.tbl_gaps_source_stock  t1
          LEFT JOIN dbo.tbl_process       t2 ON t2.proc_id   = t1.gapst_proc_id
          LEFT JOIN dbo.tbl_organizations t3 ON t3.org_code  = t1.gapst_org_code
          LEFT JOIN dbo.tbl_campus        t4 ON t4.camp_code = t1.gapst_camp_code and t4.camp_org_code = t1.gapst_org_code
          LEFT JOIN dbo.tbl_cities        t5 ON t5.city_code = t1.gapst_city 
          LEFT JOIN dbo.tbl_items         t6 ON t6.item_code = t1.gapst_item_code and t6.[item_purc_code] = @gapstPurcCode
        
          WHERE 
              t1.gapst_proc_id      = @gapstProcId
          and t1.gapst_proc_code    = COALESCE(@gapstProcCode     , t1.gapst_proc_code)
          and t1.gapst_org_code     = COALESCE(@gapstOrgCode      , t1.gapst_org_code)
          and t1.gapst_camp_code    = COALESCE(@gapstCampCode     , t1.gapst_camp_code)
          and t1.gapst_city         = COALESCE(@gapstCityCode     , t1.gapst_city)
          and t1.gapst_item_id      = COALESCE(@gapstItemId       , t1.gapst_item_id)
          and t1.gapst_library_id   = COALESCE(@gapstLibraryId    , t1.gapst_library_id)
          and t1.gapst_volumen      = COALESCE(@gapstVolumen      , t1.gapst_volumen)
          and t1.gapst_format_type  = COALESCE(@gapstFormatType   , t1.gapst_format_type)
          and t1.gapst_item_code    = COALESCE(@gapstItemCode     , t1.gapst_item_code)
        
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('gapstPurcCode',   sql.VarChar, gapstPurcCode)
            .input('gapstProcId',     sql.BigInt,  gapstProcId)
            .input('gapstProcCode',   sql.VarChar, gapstProcCode)
            .input('gapstOrgCode',    sql.VarChar, gapstOrgCode)
            .input('gapstCampCode',   sql.VarChar, gapstCampCode)
            .input('gapstCityCode',   sql.VarChar, gapstCityCode)
            .input('gapstItemId',     sql.VarChar, gapstItemId)
            .input('gapstLibraryId',  sql.VarChar, gapstLibraryId)            
            .input('gapstVolumen',    sql.VarChar, gapstVolumen)
            .input('gapstFormatType', sql.VarChar, gapstFormatType)
            .input('gapstItemCode', sql.VarChar, gapstItemCode)
            .query(sqlGetAllGapSourceStock);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Fuente de Stock encontradas' : 'No se encontraron Fuente de Stock',
            gapsSourceStock: result?.recordset
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
module.exports.getAllGapSourceStockByParameters = getAllGapSourceStockByParameters;

const bulkLoadStock = async ({
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
        , procProctId: 4
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
        let table = new sql.Table('tbl_gaps_source_stock');
        table.create = true;

        //table.columns.add('gapst_id', sql.BigInt, { nullable: false , primary: true});
        table.columns.add('gapst_proc_id', sql.BigInt, { nullable: false });
        table.columns.add('gapst_proc_code', sql.VarChar(150), { nullable: false });
        table.columns.add('gapst_org_code', sql.VarChar(10), { nullable: false });
        table.columns.add('gapst_camp_code', sql.VarChar(4), { nullable: false });
        table.columns.add('gapst_camp_library', sql.VarChar(6), { nullable: false });
        table.columns.add('gapst_camp_sub_library', sql.VarChar(6), { nullable: false });
        table.columns.add('gapst_city', sql.VarChar(20), { nullable: false });
        table.columns.add('gapst_item_code', sql.BigInt, { nullable: false });
        table.columns.add('gapst_library_id', sql.VarChar(10), { nullable: false });
        table.columns.add('gapst_item_id', sql.VarChar(30), { nullable: false });
        table.columns.add('gapst_format', sql.VarChar(1), { nullable: false });
        table.columns.add('gapst_format_type', sql.VarChar(2), { nullable: false });
        table.columns.add('gapst_volumen', sql.VarChar(1), { nullable: false });


        //const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        // Insertar registro en tabla de procesos.
        
        const resultProcess    = await ProcessModel.createProcess(headerProcess);
        let log = {
             proclProcId:resultProcess.procId
            ,proclLog : "Stock Bulk Load Started at: " + new Date()
        }
        let resultProcessLog = await ProcessLogModel.createProcessLog(log);

        if (!resultProcess || resultProcess.type === 'error') {
            log = {
                proclProcId:resultProcess.procId
               ,proclLog : "Stock Bulk Load Error:" + resultProcess.message + " at:" + new Date()
           }
            resultProcessLog = await ProcessLogModel.createProcessLog(log);            
            throw new HttpException(500, 'Error interno del servidor');

        };



        for (let i = 0; i < data.length; i++) {
            table.rows.add(
                // 0,
                resultProcess.procId,
                headerProcess.procCode,
                data[i].gapst_org_code,
                data[i].gapst_camp_code,
                data[i].gapst_camp_library,
                data[i].gapst_camp_sub_library,
                data[i].gapst_city,
                data[i].gapst_item_code,
                data[i].gapst_library_id,
                data[i].gapst_item_id,
                data[i].gapst_format,
                data[i].gapst_format_type,
                data[i].gapst_volumen
            );
        }

        // Bulk Insert de stock
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
                                message: {status:"Stock Load Success",
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
            message: {status:"Stock Load Success",
                      rows:result.rowsAffected,
                      procId:resultProcess.procId,
                      procCode:headerProcess.procCode},
        };    
        
        log = {
            proclProcId:resultProcess.procId
           ,proclLog : "Stock Bulk Load Succes:" + JSON.stringify(respuesta.message) + " at:" + new Date()
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
           ,proclLog : "Stock Bulk Load Error: " + error.message + " at:" + new Date()
       }
        resultProcessLog = await ProcessLogModel.createProcessLog(log);            
    };

    return respuesta;
};
module.exports.bulkLoadStock = bulkLoadStock;


const deleteGapSourceStock = async (procId) => {

    try {

        const sqlDeleteGapSourceStock = `
        DELETE 
          FROM tbl_gaps_source_stock
         WHERE gapst_proc_id = @procId
        `;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('procId', sql.Numeric, procId)
            .query(sqlDeleteGapSourceStock);

        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteGapSourceStock = deleteGapSourceStock;
