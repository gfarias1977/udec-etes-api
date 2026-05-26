
const { pool } = require('../../../services/database');
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
              ,t1.gapst_id                      AS "gapstId"
              ,t1.gapst_proc_id       		    AS "gapstProcId"
              ,t1.gapst_proc_code			    AS "gapstProcCode"
              ,t1.gapst_org_code			    AS "gapstOrgCode"
              ,t3.org_description			    AS "gapstOrgDescription"
              ,t1.gapst_camp_code			    AS "gapstCampCode"
              ,t4.camp_description			    AS "gapstCampDescription"
              ,t1.gapst_camp_library		    AS "gapstCampLibrary"
              ,t1.gapst_camp_sub_library	    AS "gapstCampSubLibrary"
              ,t1.gapst_city				    AS "gapstCity"
              ,t1.gapst_item_code			    AS "gapstItemCode"
              ,coalesce(t6.item_description,'') AS "gapstItemDescription"
              ,coalesce(t6.item_value_01,'')    AS "gapstItemTitulo"
              ,coalesce(t6.item_value_02,'')    AS "gapstItemAutor"
              ,coalesce(t6.item_value_03,'')    AS "gapstItemEditorial"
              ,t1.gapst_library_id			    AS "gapstLibraryId"
              ,t1.gapst_item_id				    AS "gapstItemId"
              ,t1.gapst_format				    AS "gapstFormat"
              ,t1.gapst_format_type			    AS "gapstFormatType"
              ,t1.gapst_volumen				    AS "gapstVolumen"
          FROM tbl_gaps_source_stock  t1
          LEFT JOIN tbl_process       t2 ON t2.proc_id   = t1.gapst_proc_id
          LEFT JOIN tbl_organizations t3 ON t3.org_code  = t1.gapst_org_code
          LEFT JOIN tbl_campus        t4 ON t4.camp_code = t1.gapst_camp_code and t4.camp_org_code = t1.gapst_org_code
          LEFT JOIN tbl_cities        t5 ON t5.city_code = t1.gapst_city 
          LEFT JOIN tbl_items         t6 ON t6.item_code = t1.gapst_item_code and t6.item_purc_code = $1
        
          WHERE 
              t1.gapst_proc_id      = $2
          and t1.gapst_proc_code    = COALESCE($3     , t1.gapst_proc_code)
          and t1.gapst_org_code     = COALESCE($4      , t1.gapst_org_code)
          and t1.gapst_camp_code    = COALESCE($5     , t1.gapst_camp_code)
          and t1.gapst_city         = COALESCE($6     , t1.gapst_city)
          and t1.gapst_item_id      = COALESCE($7       , t1.gapst_item_id)
          and t1.gapst_library_id   = COALESCE($8    , t1.gapst_library_id)
          and t1.gapst_volumen      = COALESCE($9      , t1.gapst_volumen)
          and t1.gapst_format_type  = COALESCE($10   , t1.gapst_format_type)
          and t1.gapst_item_code    = COALESCE($11     , t1.gapst_item_code)
        
        `;

        const result = await pool.query(sqlGetAllGapSourceStock, [gapstPurcCode, gapstProcId, gapstProcCode, gapstOrgCode, gapstCampCode, gapstCityCode, gapstItemId, gapstLibraryId, gapstVolumen, gapstFormatType, gapstItemCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Fuente de Stock encontradas' : 'No se encontraron Fuente de Stock',
            gapsSourceStock: result?.rows
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insertar registro en tabla de procesos.
        const resultProcess = await ProcessModel.createProcess(headerProcess);
        let log = {
             proclProcId: resultProcess.procId
            ,proclLog: "Stock Bulk Load Started at: " + new Date()
        };
        let resultProcessLog = await ProcessLogModel.createProcessLog(log);

        if (!resultProcess || resultProcess.type === 'error') {
            log = {
                proclProcId: resultProcess.procId
               ,proclLog: "Stock Bulk Load Error:" + resultProcess.message + " at:" + new Date()
            };
            resultProcessLog = await ProcessLogModel.createProcessLog(log);
            throw new HttpException(500, 'Error interno del servidor');
        };

        // Bulk Insert de stock usando unnest
        const sqlBulkInsert = `
            INSERT INTO tbl_gaps_source_stock (
                gapst_id,
                gapst_proc_id, gapst_proc_code, gapst_org_code, gapst_camp_code,
                gapst_camp_library, gapst_camp_sub_library, gapst_city, gapst_item_code,
                gapst_library_id, gapst_item_id, gapst_format, gapst_format_type, gapst_volumen
            )
            SELECT nextval('tbl_gaps_source_stock_gapst_id_seq'), * FROM unnest(
                $1::bigint[], $2::text[], $3::text[], $4::text[],
                $5::text[], $6::text[], $7::text[], $8::bigint[],
                $9::text[], $10::text[], $11::text[], $12::text[], $13::text[]
            )
        `;
        const cols = {
            gapst_proc_id:           data.map(() => resultProcess.procId),
            gapst_proc_code:         data.map(() => headerProcess.procCode),
            gapst_org_code:          data.map(r => r.gapst_org_code),
            gapst_camp_code:         data.map(r => r.gapst_camp_code),
            gapst_camp_library:      data.map(r => r.gapst_camp_library),
            gapst_camp_sub_library:  data.map(r => r.gapst_camp_sub_library),
            gapst_city:              data.map(r => r.gapst_city),
            gapst_item_code:         data.map(r => r.gapst_item_code),
            gapst_library_id:        data.map(r => r.gapst_library_id),
            gapst_item_id:           data.map(r => r.gapst_item_id),
            gapst_format:            data.map(r => r.gapst_format),
            gapst_format_type:       data.map(r => r.gapst_format_type),
            gapst_volumen:           data.map(r => r.gapst_volumen),
        };
        const result = await client.query(sqlBulkInsert, Object.values(cols));

        await client.query('COMMIT');
        console.log(result);
        respuesta = {
            type: 'ok',
            status: 200,
            message: {
                status: "Stock Load Success",
                rows: result.rowCount,
                procId: resultProcess.procId,
                procCode: headerProcess.procCode,
            },
        };

        log = {
            proclProcId: resultProcess.procId
           ,proclLog: "Stock Bulk Load Succes:" + JSON.stringify(respuesta.message) + " at:" + new Date()
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
           ,proclLog: "Stock Bulk Load Error: " + error.message + " at:" + new Date()
        };
        resultProcessLog = await ProcessLogModel.createProcessLog(log);
    } finally {
        client.release();
    };

    return respuesta;
};
module.exports.bulkLoadStock = bulkLoadStock;


const deleteGapSourceStock = async (procId) => {

    try {

        const sqlDeleteGapSourceStock = `
        DELETE 
          FROM tbl_gaps_source_stock
         WHERE gapst_proc_id = $1
        `;

        const result = await pool.query(sqlDeleteGapSourceStock, [procId]);

        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteGapSourceStock = deleteGapSourceStock;
