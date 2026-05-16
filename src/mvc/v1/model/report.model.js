const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const performance = process.env.REPORT_PERFORMANCE || 100;
const students = process.env.REPORT_STUDENTS || 100;

const getReportStandardAppliedToMayor = async(buCode, stdCode, purcCode, stdVersion, majorCode) => {

    let respuesta;
    try {
        const sqlGetStandardAppliedToMayor = `
            SELECT  
            t2.major_org_code      majorOrgCode,
            t1.[prgd_cours_code]   prgdCourseId,
            t1.[prgd_prog_code]    prgdCode,
            t1.[prgd_level]        prgdLevel,
            t3.cours_code          courseCode,
            t3.[cours_description] courseDescription,
            CASE t3.[cours_duration] WHEN 'A' THEN 'Anual'
                              WHEN 'M' THEN 'Mensual'
                              WHEN 'O' THEN 'Otros'
                              WHEN 'S' THEN 'Semestral'
                              WHEN 'T' THEN 'Trimestral'
                                       ELSE 'N/E'
            END courseDuration,
             t5.[item_code] itemCode,
            t5.[item_description] itemDescription,
            t4.[stdc_performance] stdcPerformance,
            t5.[item_unit_value] itemUnitValue,
            t4.[stdc_maintenance_cicle] [stdcMaintenanceCicle],
            t4.[stdc_renewal_cicle] stdcRenewalCicle,
            t4.[stdc_rlay_code] stdcRlayCode,
            t6.[rlay_description] rlayDescription 
         FROM
            [tbl_programs_grids] t1   
            JOIN  [tbl_majors]   t2 ON 
                t2.major_code = t1.prgd_major_code
            LEFT JOIN [tbl_courses] t3 ON 
                t3.[cours_org_code] = t2.major_org_code
                and t3.cours_code = t1.[prgd_cours_code]
            JOIN [tbl_standards_courses] t4 ON
                t4.[stdc_bu_code] LIKE @buCode
            AND t4.[stdc_std_code] LIKE @stdCode
            AND t4.[stdc_purc_code] = @purcCode 
            AND t4.[stdc_std_version] = @stdVersion
            AND t4.[stdc_cours_code] = t3.[cours_code]
            AND t4.[stdc_org_code] = t3.[cours_org_code]
            LEFT JOIN [tbl_items] t5 ON
               t5.[item_code] = t4.[stdc_item_code]
            LEFT JOIN [dbo].[tbl_rooms_layout] t6 ON
                t6.[rlay_code] = t4.[stdc_rlay_code]
         WHERE
                t1.[prgd_major_code] LIKE @majorCode
            AND t1.[prgd_level] > 0
           -- AND t4.[stdc_status] = 'S'
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('buCode',      sql.VarChar, buCode    )
                            .input('stdCode',     sql.VarChar, stdCode   )
                            .input('purcCode',    sql.VarChar, purcCode  )
                            .input('stdVersion',  sql.Int, stdVersion    )
                            .input('majorCode',   sql.VarChar, majorCode )
                            .query(sqlGetStandardAppliedToMayor);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Reporte generado con exito' : 'No se encontraron registros',
            report:  result?.recordset
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
module.exports.getReportStandardAppliedToMayor = getReportStandardAppliedToMayor;


const getReportStandardByRoomLayout = async(buCode, stdCode, purcCode, stdVersion, rlayCode) => {

    let respuesta;
    try {
        const sqlGetStandardByRoomLayout  = `
            SELECT  
                t1.[stdc_rlay_code] as stdcRlayCode,
                t2.[rlay_description] as rlayDescription,
                t3.[item_code] as itemCode,
                t3.[item_description] as itemDescription,
                t4.[cours_code] as coursCode,
                t4.[cours_description] as  coursDescription,
                CASE t4.[cours_duration] WHEN 'A' THEN 'Anual'
                                WHEN 'M' THEN 'Mensual'
                                WHEN 'O' THEN 'Otros'
                                WHEN 'S' THEN 'Semestral'
                                WHEN 'T' THEN 'Trimestral'
                                        ELSE 'N/E'
                END coursDuration,
                t1.[stdc_performance] as stdcPerformance,
                CASE 
                WHEN t1.[stdc_performance] = 0 THEN 0
                ELSE ROUND(t2.[rlay_capacity] / t1.[stdc_performance] , 0) 
                end quantity,
                t3.[item_unit_value] as itemUnitValue,
                t3.[item_unit_value] * 
                CASE 
                WHEN t1.[stdc_performance] = 0 THEN 0
                ELSE ROUND (@performance / t1.[stdc_performance], 1)
                END inversion,
                t1.[stdc_maintenance_cicle] as stdcMaintenanceCicle,
                t1.[stdc_renewal_cicle] as stdcRenewalCicle
        FROM [tbl_standards_courses] t1
                JOIN [tbl_rooms_layout] t2
                ON t2.[rlay_code] = t1.[stdc_rlay_code]
                LEFT JOIN [tbl_items] t3
                ON t3.[item_code] = t1.[stdc_item_code]
                LEFT JOIN [tbl_courses] t4
                ON     t4.[cours_org_code] = t1.[stdc_org_code]
                    AND t4.[cours_code] = t1.[stdc_cours_code]
        WHERE     t1.[stdc_bu_code] LIKE @buCode
                AND t1.[stdc_std_code] LIKE @stdCode
                AND t1.[stdc_std_version] = @stdVersion
                AND t1.[stdc_rlay_code] LIKE @rlayCode
                AND t1.[stdc_purc_code] = @purcCode
    ORDER BY t1.[stdc_rlay_code], t1.[stdc_item_code], t1.[stdc_cours_code];

        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('buCode',      sql.VarChar, buCode    )
                            .input('stdCode',     sql.VarChar, stdCode   )
                            .input('purcCode',    sql.VarChar, purcCode  )
                            .input('stdVersion',  sql.Int, stdVersion    )
                            .input('rlayCode',    sql.VarChar, rlayCode  )
                            .input('performance', sql.Int, performance   )
                            .query(sqlGetStandardByRoomLayout);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Reporte generado con exito' : 'No se encontraron registros',
            report:  result?.recordset
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
module.exports.getReportStandardByRoomLayout = getReportStandardByRoomLayout;

const getReportEquipmentByMayor = async(majorCode, progCode, buCode) => {

    let respuesta;
    try {
        const sqlGetEquipmentByMayor  = `
            SELECT  
               programs_grid.*,
               t1.[stdc_purc_code] stdcPurcCode,
               t1.[stdc_item_code] stdcItemCode,
               t2.[item_description] itemDescription,
               coalesce(t1.[stdc_performance], 0) stdcPerformance,
               @students students,
               CASE
                  WHEN (t1.[stdc_performance] = 0) OR (t1.[stdc_performance] IS NULL) THEN 0
                  WHEN t3.[rlay_capacity] > 0 THEN ROUND( t3.[rlay_capacity] / t1.[stdc_performance], 0 )
                  ELSE
                    ROUND(@students / t1.[stdc_performance], 0 )
               END quantity,
               t2.[item_unit_value] itemUnitValue,
               CASE
                 WHEN t1.[stdc_performance] = 0 THEN 0
                  WHEN t3.[rlay_capacity] > 0 THEN t2.[item_unit_value]  * ROUND( t3.[rlay_capacity] / t1.[stdc_performance], 0 )
                 ELSE
                     t2.[item_unit_value] * ROUND( @students / t1.[stdc_performance], 0 )
               END inversion,
               t1.[stdc_maintenance_cicle] stdcMaintenanceCicle,
               t1.[stdc_renewal_cicle] stdcRenewalCicle,
               t1.[stdc_rlay_code] stdcRlayCode,
               coalesce(t3.[rlay_capacity] , 0) rlayCapacity,
               t3.[rlay_description] rlayDescription
            FROM (
               SELECT
                  t2.[major_org_code] majorOrgCode,
                  t2.[major_code] majorCode,
                  t1.[prgd_prog_code] prgdProgCode,
                  t1.[prgd_level] prgdLevel,
                  t3.[cours_code] coursCode,
                  t3.[cours_description] coursDescription,
                  t3.[cours_duration] coursDuration
               FROM
                  [tbl_programs_grids] t1
                  JOIN [tbl_majors] t2 ON
                      t2.[major_code] = t1.[prgd_major_code]
                  LEFT JOIN [dbo].[tbl_courses] t3 ON
                      t3.[cours_org_code] = t2.[major_org_code]
                  AND t3.[cours_code] = t1.[prgd_cours_code]
               WHERE
                      t1.[prgd_major_code] = @majorCode
                  AND t1.[prgd_prog_code] = @progCode
                  AND t1.[prgd_level] > 0
               ) programs_grid
               --LEFT
               JOIN [tbl_standards_courses] t1 ON
                   t1.[stdc_bu_code] LIKE @buCode
               AND t1.[stdc_org_code] = programs_grid.majorOrgCode
               AND t1.[stdc_cours_code] = programs_grid.coursCode
               AND t1.[stdc_status] = 'S'
               LEFT JOIN [tbl_items] t2 ON
                  t2.[item_purc_code] = t1.[stdc_purc_code]
               AND t2.[item_code] = t1.[stdc_item_code]
               LEFT JOIN [tbl_rooms_layout] t3 ON
                   t3.[rlay_code] = t1.[stdc_rlay_code]
            ORDER BY
               t1.[stdc_org_code],
               t1.[stdc_scho_code],
               programs_grid.[prgdProgCode],
               programs_grid.[prgdLevel],
               t2.[item_code]
                     `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('majorCode',    sql.VarChar, majorCode  )
                            .input('progCode',     sql.VarChar, progCode   )
                            .input('buCode',       sql.VarChar, buCode     )
                            .input('students',     sql.VarChar, students   )
                            .query(sqlGetEquipmentByMayor);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Reporte generado con exito' : 'No se encontraron registros',
            report:  result?.recordset
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
module.exports.getReportEquipmentByMayor = getReportEquipmentByMayor;




