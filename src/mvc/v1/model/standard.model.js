const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const standardExists = async ( standardCode, standardOrgCode, standardBuCode, standardPurcCode, standardVersion) => {

    let respuesta;
    try {
        const sqlStandardExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                SELECT 'Estandar ya existe.'  AS  validacion,
                        count(*) AS total
                    FROM tbl_standards t1
                WHERE t1.std_code          =   @standardCode
                    AND t1.std_org_code    =   @standardOrgCode
                    AND t1.std_bu_code     =   @standardBuCode
                    AND t1.std_purc_code   =   @standardPurcCode
                    AND t1.std_version     =    @standardVersion
                ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('standardCode', sql.VarChar, standardCode )
                            .input('standardOrgCode',  sql.VarChar, standardOrgCode )
                            .input('standardBuCode', sql.VarChar, standardBuCode )
                            .input('standardPurcCode',  sql.VarChar, standardPurcCode )
                            .input('standardVersion', sql.Int, standardVersion )
                            .query(sqlStandardExists);

        respuesta = {
            type: result?.recordset[0].validacion ? 'error' : 'ok',
            status: 200,
            message: result?.recordset[0].validacion,
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
module.exports.standardExists = standardExists;

const getAllStandardsByUserId = async( userId, businessUnitCode, purchaseAreaCode ) => {

    let respuesta;
    try {
        const sqlGetAllStandards = `
             SELECT ROW_NUMBER() OVER(ORDER BY  t1.std_code ASC) AS id
                    ,t1.std_purc_code              AS    stdPurcCode               
                    ,t7.purc_description		   AS 	stdPurcDescription		
                    ,t1.std_name				   AS 	stdName				
                    ,t1.std_code				   AS 	stdCode				
                    ,t1.std_bu_code				   AS 	stdBuCode				
                    ,t1.std_bu_code          	   AS 	stdBuName	
                    ,t1.std_org_code			   AS 	stdOrgCode			
                    ,t3.org_description			   AS 	stdOrgDescription			
                    ,t4.cacc_description		   AS 	stdCaccDescription		
                    ,t4.cacc_code				   AS 	stdCaccCode				
                    ,t5.scho_description		   AS 	stdSchoDescription		
                    ,t5.scho_code				   AS 	stdSchoCode				
                    ,t1.std_registration_date	   AS 	stdRegistrationDate	
                    ,t1.std_year				   AS 	stdYear				
                    ,t1.std_version				   AS 	stdVersion	
                    ,COALESCE(t1.std_available_for_purchase, 'N') AS stdAvailableForPurchase 			
                    ,t1.std_status                 AS 	stdStatus              
               FROM dbo.tbl_standards t1
                JOIN dbo.tbl_users_business_units t2
                    ON t2.usbu_bu_code     =   t1.std_bu_code
                    AND t2.usbu_user_id     =   @userId
                    AND t2.usbu_bu_code     =   @businessUnitCode
                    AND t2.usbu_status      =   'S'
                LEFT JOIN dbo.tbl_organizations t3
                        ON t3.org_code         =   t1.std_org_code
                LEFT JOIN dbo.tbl_charge_account t4
                        ON t4.cacc_code        =   t1.std_cacc_code
                LEFT JOIN dbo.tbl_schools t5
                        ON t5.scho_org_code    =   t1.std_org_code
                        AND scho_code           =   t1.std_scho_code
                JOIN dbo.tbl_users_charge_accounts t6
                        ON t6.ucac_user_id     =   @userId
                        AND t6.ucac_purc_code   =   t1.std_purc_code
                        AND t6.ucac_cacc_code   =   t1.std_cacc_code
                JOIN tbl_purchase_areas t7
                        ON t7.purc_code        =   t1.std_purc_code
                        AND t7.purc_status      =   'S'
            WHERE t1.std_purc_code    =   @purchaseAreaCode
                        AND t5.scho_description IS NOT NULL
            ORDER BY t1.std_code,
                    t1.std_year DESC,
                    t1.std_version DESC
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('userId', sql.Int, userId )
                            .input('businessUnitCode', sql.VarChar, businessUnitCode )
                            .input('purchaseAreaCode', sql.VarChar, purchaseAreaCode )
                            .query(sqlGetAllStandards);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Estandares encontrados' : 'No se encontraron Estandares',
            standards: result?.recordset
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
module.exports.getAllStandardsByUserId = getAllStandardsByUserId;


const getStandardById = async( 
    stdCode,   
    stdOrgCode,
    stdBuCode, 
    stdPurcCode,
    stdYear,
    stdVersion,
    stdUserId
     ) => {

    try {
        
        const sqlGetStandardByKey = `
            SELECT DISTINCT 
                    ROW_NUMBER() OVER(ORDER BY  t1.std_code ASC) AS id
                    ,t1.std_code                  AS  stdCode                
                    ,t1.std_org_code              AS  stdOrgCode            
                    ,t2.org_description			  AS  orgDescription			
                    ,t1.std_bu_code				  AS  stdBuCode				
                    ,t1.std_purc_code			  AS  stdPurcCode			
                    ,t1.std_version				  AS  stdVersion				
                    ,t1.std_name				  AS  stdName				
                    ,t1.std_registration_date	  AS  stdRegistrationDate	
                    ,t1.std_cacc_code			  AS  stdCaccCode			
                    ,t3.cacc_description		  AS  stdCaccDescription		
                    ,t1.std_scho_code			  AS  stdSchoCode			
                    ,t4.scho_description		  AS  stdSchoDescription		
                    ,t1.std_year                  AS  stdYear
                    ,COALESCE(t1.std_available_for_purchase, 'N') AS stdAvailableForPurchase
                    ,t1.std_status AS stdStatus
            FROM tbl_standards t1
                LEFT JOIN tbl_organizations t2 ON t2.org_code = t1.std_org_code
                LEFT JOIN tbl_charge_account t3 ON t3.cacc_code = t1.std_cacc_code AND t3.cacc_org_code = t2.org_code
                LEFT JOIN tbl_schools t4 ON t4.scho_code = t1.std_scho_code and t4.scho_org_code = t1.std_org_code
                LEFT JOIN tbl_users_business_units t5 ON  t5.usbu_bu_code = t1.std_bu_code 
                LEFT JOIN tbl_users_charge_accounts t6 ON  t6.ucac_cacc_code = t1.std_cacc_code AND t6.ucac_purc_code = t1.std_purc_code
            WHERE
                        t1.std_code      = @stdCode
                    AND t1.std_org_code  = @stdOrgCode
                    AND t1.std_bu_code   = @stdBuCode
                    AND t1.std_purc_code = @stdPurcCode
                    AND t1.std_year      = @stdYear
                    AND t1.std_version   = @stdVersion
                    AND t5.usbu_user_id  = @stdUserId
                    AND t6.ucac_user_id  = @stdUserId 
                    AND t5.usbu_bu_code  = @stdBuCode
                    AND t4.scho_description IS NOT NULL
            ORDER BY  t1.std_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdCode',     sql.VarChar, stdCode     )
                            .input('stdOrgCode',  sql.VarChar, stdOrgCode  )
                            .input('stdBuCode',   sql.VarChar, stdBuCode   )
                            .input('stdPurcCode', sql.VarChar, stdPurcCode )
                            .input('stdYear',     sql.Int,     stdYear     )
                            .input('stdVersion',  sql.Int,     stdVersion  )
                            .input('stdUserId',   sql.Int,     stdUserId   )
                            .query(sqlGetStandardByKey);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getStandardById = getStandardById;

const getStandardBySearch = async( 
    stdCode,   
    stdOrgCode,
    stdBuCode, 
    stdPurcCode,
    stdYear,
    stdVersion,
    stdUserId,
    stdPurchase ) => {

    let respuesta;
    try {
       
        const sqlGetStandardBySearch = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.stdCode ASC) AS id, t1.* FROM (
            SELECT DISTINCT 
                    --ROW_NUMBER() OVER(ORDER BY  t1.std_code ASC) AS id
                  t1.std_code                  AS  stdCode                
                 ,t1.std_org_code              AS  stdOrgCode            
                 ,t2.org_description		   AS  orgDescription			
                 ,t1.std_bu_code			   AS  stdBuCode				
                 ,t1.std_purc_code			   AS  stdPurcCode			
                 ,t1.std_version			   AS  stdVersion				
                 ,t1.std_name				   AS  stdName				
                 ,t1.std_registration_date	   AS  stdRegistrationDate	
                 ,t1.std_cacc_code			   AS  stdCaccCode			
                 ,t3.cacc_description		   AS  stdCaccDescription		
                 ,t1.std_scho_code			   AS  stdSchoCode			
                 ,t4.scho_description		   AS  stdSchoDescription		
                 ,t1.std_year                  AS  stdYear
                 ,COALESCE(t1.std_available_for_purchase, 'N') AS stdAvailableForPurchase
                 ,t1.std_status AS stdStatus
                 ,'[' + CAST(t1.std_version AS VARCHAR)  + ']' +  t1.std_name  AS stdOptionLabel
            FROM tbl_standards t1
            LEFT JOIN tbl_organizations t2 ON t2.org_code = t1.std_org_code
            LEFT JOIN tbl_charge_account t3 ON t3.cacc_code = t1.std_cacc_code AND t3.cacc_org_code = t2.org_code
            LEFT JOIN tbl_schools t4 ON t4.scho_code = t1.std_scho_code and t4.scho_org_code = t1.std_org_code
            LEFT JOIN tbl_users_business_units t5 ON  t5.usbu_bu_code = t1.std_bu_code 
            LEFT JOIN tbl_users_charge_accounts t6 ON  t6.ucac_cacc_code = t1.std_cacc_code AND t6.ucac_purc_code = t1.std_purc_code
            WHERE
                    t1.std_code      = COALESCE(@stdCode,t1.std_code)
                AND t1.std_org_code  = COALESCE(@stdOrgCode,t1.std_org_code)
                AND t1.std_bu_code   = COALESCE(@stdBuCode,t1.std_bu_code)
                AND t1.std_purc_code = COALESCE(@stdPurcCode,t1.std_purc_code)
                AND t1.std_year      = COALESCE(@stdYear,t1.std_year)
                AND t1.std_version   = COALESCE(@stdVersion,t1.std_version)
                AND t5.usbu_user_id  = COALESCE(@stdUserId, t5.usbu_user_id)
                AND t6.ucac_user_id  = COALESCE(@stdUserId, t6.ucac_user_id)
                AND t5.usbu_bu_code  = COALESCE(@stdBuCode,t5.usbu_bu_code)
                AND t1.std_available_for_purchase  = COALESCE(@stdPurchase,t1.std_available_for_purchase)
                AND t4.scho_description IS NOT NULL
                --ORDER BY  t1.std_code 
                ) t1
                ORDER BY  t1.stdCode 
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdCode',     sql.VarChar, stdCode )
                            .input('stdOrgCode',  sql.VarChar, stdOrgCode )
                            .input('stdBuCode',   sql.VarChar, stdBuCode )
                            .input('stdPurcCode', sql.VarChar, stdPurcCode )
                            .input('stdYear',     sql.Int,     stdYear )
                            .input('stdVersion',  sql.Int,     stdVersion )
                            .input('stdPurchase', sql.VarChar, stdPurchase )
                            .input('stdUserId',   sql.Int,     stdUserId )
                            .query(sqlGetStandardBySearch);
        
            respuesta = {
                type: 'ok',
                status: 200,
                message: result?.recordset.length > 0 ? 'Estandares encontrados' : 'No se encontraron Estandares',
                standards: result?.recordset
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

module.exports.getStandardBySearch = getStandardBySearch;

const getStandardApplieToMajor = async( purcCode, buCode, majorCode, stdCode, stdVersion ) => {

    let respuesta;
    try {
        const sqlGetStandardApplieToMajor = `
        select
             major_org_code         majorOrgCode
            ,prgd_major_code        prgdMajorCode
            ,prgd_prog_code         prgdProgCode
            ,prgd_level             prgdLevel
            ,cours_code             coursCode
            ,cours_description      coursDescription
            ,case cours_duration when 'A' then 'Anual'
                            when 'M' then 'Mensual'
                            when 'O' then 'Otros'
                            when 'S' then 'Semestral'
                            when 'T' then 'Trimestral'
                                    else 'N/E'
             end                     coursDuration
            ,stdc_item_code          stdcItemCode
            ,item_description        itemDescription
            ,stdc_performance        stdcPerformance
            ,item_unit_value         itemUnitValue
            ,stdc_maintenance_cicle  stdcMaintenanceCicle
            ,stdc_renewal_cicle      stdcRenewalCicle     
            ,stdc_rlay_code          stdcRlayCode
            ,rlay_rlat_code          stdcRlatCode
            ,rlay_description        rlayDescription
        from
                tbl_programs_grids
            join tbl_majors on
                major_code = prgd_major_code 
            left join tbl_courses on
                cours_org_code = major_org_code
            and cours_code = prgd_cours_code
            join tbl_standards_courses on
                stdc_bu_code     = @buCode
            and stdc_std_code    = @stdCode
            and stdc_purc_code   = @purcCode
            and stdc_std_version = @stdVersion
            and stdc_org_code    = cours_org_code
            and stdc_cours_code  = cours_code
            left join tbl_items on
                item_code        = stdc_item_code
            left join tbl_rooms_layout on
                       rlay_code = stdc_rlay_code
        where
                prgd_major_code = @MajorCode
            and prgd_level > 0
            and stdc_status = 'S';
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode',   sql.VarChar, purcCode )
                            .input('buCode',     sql.VarChar, buCode )
                            .input('majorCode',  sql.VarChar, majorCode )
                            .input('stdCode',    sql.VarChar, stdCode )
                            .input('stdVersion', sql.Int,     stdVersion )                            
                            .query(sqlGetStandardApplieToMajor);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Estandares Aplicadoa a Carrera encontrados' : 'No se encontraron Estandares Aplicadoa a Carrera',
            standardsAppliedToMajor: result?.recordset
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
module.exports.getStandardApplieToMajor = getStandardApplieToMajor;

const getStandardApplieToRoomLayout = async( purcCode, buCode, rlayCode, stdCode, stdVersion ) => {

    let respuesta;
    try {
        const sqlGetStandardApplieToRoomLayout = `
         SELECT rlay_code rlayCode,
                rlay_description rlayDescription,
                item_code itemCode,
                item_description itemDescription,
                cours_code coursCode,
                cours_description coursDescription,
                CASE cours_duration WHEN 'A' THEN 'Anual'
                                WHEN 'M' THEN 'Mensual'
                                WHEN 'O' THEN 'Otros'
                                WHEN 'S' THEN 'Semestral'
                                WHEN 'T' THEN 'Trimestral'
                                        ELSE 'N/E'
                END coursDuration,
                stdc_performance stdcPerformance,
                coalesce (stdc_performance, 0, 0, ROUND (rlay_capacity / stdc_performance, 0)) quantity,
                item_unit_value itemUnitValue,
                item_unit_value * coalesce (stdc_performance, 0, 0, ROUND (100 / stdc_performance, 1)) investment,
                stdc_maintenance_cicle stdcMaintenance,
                stdc_renewal_cicle stdcRenewalCicle
        FROM tbl_standards_courses t1
                JOIN tbl_rooms_layout t2
                ON rlay_code = stdc_rlay_code
                LEFT JOIN tbl_items t3
                ON item_code = stdc_item_code
                LEFT JOIN tbl_courses
                ON     cours_org_code = stdc_org_code
                    AND cours_code = stdc_cours_code
        WHERE     stdc_bu_code LIKE @buCode
                AND stdc_std_code LIKE @stdCode
                AND stdc_std_version = @stdVersion
                AND stdc_rlay_code LIKE @rlayCode
                AND stdc_purc_code = @purcCode
        ORDER BY stdc_rlay_code, stdc_item_code, stdc_cours_code;
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('purcCode',   sql.VarChar, purcCode )
                            .input('buCode',     sql.VarChar, buCode )
                            .input('rlayCode',   sql.VarChar, rlayCode )
                            .input('stdCode',    sql.VarChar, stdCode )
                            .input('stdVersion', sql.Int,     stdVersion )                            
                            .query(sqlGetStandardApplieToRoomLayout);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Estandares Aplicadoa a Recintos Prototipo encontrados' : 'No se encontraron Estandares Aplicadoa a Recintos Prototipos',
            standardsAppliedToRoomLayout: result?.recordset
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
module.exports.getStandardApplieToRoomLayout = getStandardApplieToRoomLayout;

const getStandardEquipmentByMajor = async( majorCode, progCode, purcCode ) => {

    let respuesta;
    try {
        const sqlGetStandardEquipmentByMajor = `
        SELECT
            grid.*,
            stdc_purc_code stdcPurcCode,
            stdc_item_code stdcItemCode,
            item_description stdcItemDescription,
            coalesce(stdc_performance, 0) stdcPerformance,
            100 stdcStudents,
            CASE
            WHEN (stdc_performance = 0) OR (stdc_performance IS NULL) THEN 0
            WHEN rlay_capacity > 0 THEN ROUND( rlay_capacity / stdc_performance, 0 )
            ELSE
                --ROUND( PNALUMNOS / STA_RENDIMIENTO, 1 )
                ROUND( 100 / stdc_performance, 0 )
            END quantity,
            item_unit_value stdcItemUnitValue,
            CASE
            WHEN stdc_performance = 0 THEN 0
            WHEN rlay_capacity > 0 THEN item_unit_value * ROUND( rlay_capacity / stdc_performance, 0 )
            ELSE
                item_unit_value * ROUND( 100 / stdc_performance, 0 )
            END stdcInvestment,
            stdc_maintenance_cicle stdcMaintenanceCicle,
            stdc_renewal_cicle stdcRenewalCicle,
            stdc_rlay_code stdRlayCode,
            coalesce(rlay_capacity, 0) rlayCapacity,
            rlay_description stdcRlayDescription   
        FROM (
            SELECT
            t02.major_org_code    majorOrgCode,
            t01.prgd_major_code   majorCode,
            t01.prgd_prog_code    prgdCode,
            t01.prgd_level        prgdLevel,
            t03.cours_code        coursCode,
            t03.cours_description courseDescription,
            t03.cours_duration    coursDuration
            FROM
                    tbl_programs_grids t01
            JOIN tbl_majors t02 ON
                t02.major_code = t01.prgd_major_code
            LEFT JOIN tbl_courses t03 ON
                t03.cours_org_code = t02.major_org_code
            AND t03.cours_code = t01.prgd_cours_code
            WHERE
                t01.prgd_major_code = @majorCode
            AND t01.prgd_prog_code = @progCode
            AND t01.prgd_level > 0
            ) grid
            --LEFT
            JOIN tbl_standards_courses t01 ON
                t01.stdc_purc_code LIKE @purcCode
            AND t01.stdc_org_code = grid.majorOrgCode
            AND t01.stdc_cours_code = grid.coursCode
            AND t01.stdc_status = 'S'
            LEFT JOIN tbl_items t02 ON
                t02.item_purc_code = t01.stdc_purc_code
            AND t02.item_code = t01.stdc_item_code
            LEFT JOIN tbl_rooms_layout t03 ON
                t03.rlay_code = t01.stdc_rlay_code
        ORDER BY
            stdc_org_code,
            stdc_cours_code,
            grid.prgdCode,
            grid.prgdLevel,
            grid.coursCode;
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('majorCode',  sql.VarChar, majorCode )
                            .input('progCode',   sql.VarChar, progCode )
                            .input('purcCode',   sql.VarChar, purcCode )                                                     
                            .query(sqlGetStandardEquipmentByMajor);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Equipamiento de Carrera encontrados' : 'No se encontraron Equipamiento de Carrera',
            standardsEquipmentByMajor: result?.recordset
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
module.exports.getStandardEquipmentByMajor = getStandardEquipmentByMajor;

const getBookCoverage = async( orgCode, majorCode, progCode, cityCode, idStd, idDda, idStock ) => {

    let respuesta;
    try {
        const sqlGetBookCoverage = `
            SELECT
                    INST                  AS orgCode,
                    CARR_ID               AS majorCode,
                    PLAN_ID               AS progCode,
                    NIVEL                 AS levelCode,
                    ASIG_ID               AS coursCode,
                    ASIGNATURA            AS coursDescription,
                    STA_CBI_CODIGO        AS itemCode,
                    CBI_DESCRIPCION       AS itemDescripcion,
                    STA_RENDIMIENTO       AS stdPerformance,
                    NRO_ALUMNOS           AS studentQty,
                    STOCK                 AS stock,
                    STOCK_IL              AS stockUnlimited,
                    DEMANDA               AS demand,
                    CUMPLIM_TIT           AS coverageTit,
                    TIENE_STK_IL          AS haveStockUnlimited,
                    CUMPLIM_REND          AS coveragePerformance,
                    CUMPLIM_REND_AJUSTADO AS coveragePerformanceAdjusted,
                    CIUDAD                AS city,
                    'CALCULO NORMAL'      AS obs
            FROM (
            SELECT RES3.*,
            ROW_NUMBER() OVER (PARTITION BY INST   ,CARR_ID  ,NIVEL    ,ASIG_ID  ,STA_ACO_CODIGO,STA_CBI_CODIGO ORDER BY DEMANDA DESC) MAYOR
            --ROW_NUMBER() OVER (PARTITION BY orgCode,majorCode,levelCode,coursCode,STA_ACO_CODIGO,STA_CBI_CODIGO ORDER BY DEMANDA DESC) MAYOR
            FROM(
                SELECT DISTINCT RES2.*,
                    CASE
                        WHEN DEMANDA = 0 THEN STOCK
                        ELSE FORMAT(ROUND((STOCK * 100) / DEMANDA,0),'#########')
                    END CUMPLIM_REND,
                    CASE
                        WHEN DEMANDA > 0 AND ROUND((STOCK * 100) / DEMANDA,0) > 100 THEN '100%'
                        WHEN STOCK_IL > 0 THEN '100%'
                        WHEN DEMANDA > 0 THEN CONCAT(CAST(FORMAT(ROUND((STOCK * 100) / DEMANDA,0),'#########') as varchar(30)),'%')
                        WHEN NRO_ALUMNOS = 0 AND STOCK > 0 THEN '100%' 
                        ELSE '0%'
                    END CUMPLIM_REND_AJUSTADO,
                    @cityCode CIUDAD
                FROM(
                    SELECT
                        RES.*,
                        CASE
                            WHEN STA_CBI_CODIGO IS NULL AND NRO_ALUMNOS = 1 THEN 1
                            WHEN STA_CBI_CODIGO IS NULL AND NRO_ALUMNOS > 0 AND INST = 'UNV' THEN FORMAT(ROUND([dbo].[get_round_minus05](NRO_ALUMNOS/10),0),'#########')
                            WHEN STA_CBI_CODIGO IS NULL AND NRO_ALUMNOS > 0 AND INST <> 'UNV' THEN FORMAT(ROUND([dbo].[get_round_minus05](NRO_ALUMNOS/20),0), '#########')
                            WHEN STOCK_IL > 0 AND NRO_ALUMNOS > 0 THEN NRO_ALUMNOS
                            WHEN (STA_RENDIMIENTO = 0) OR (STA_RENDIMIENTO IS NULL) THEN 0
                            WHEN NRO_ALUMNOS = 0 AND STOCK > 0 THEN 0 
                            WHEN NRO_ALUMNOS = 0 THEN STOCK
                            ELSE
                            FORMAT(ROUND([dbo].[get_round_minus05](NRO_ALUMNOS / STA_RENDIMIENTO),0),'#########')
                        END DEMANDA,
                        CASE
                            WHEN STOCK > 0 THEN '100%'
                            WHEN STOCK_IL > 0 THEN '100%'
                            ELSE '0%'
                        END CUMPLIM_TIT,
                        CASE
                            WHEN STOCK_IL > 0 THEN 0
                            ELSE STOCK
                        END STOCK_FINAL,
                        CASE
                            WHEN STOCK_IL > 0 THEN 'S'
                            ELSE 'N'
                        END TIENE_STK_IL
                    FROM(
                    SELECT
                            MALLA.*,
                            [gaps_stdc_purc_code] STA_ACO_CODIGO,
                            [gaps_stdc_item_code] STA_CBI_CODIGO,
                            [item_description]    CBI_DESCRIPCION,
                            FORMAT(ROUND(COALESCE([gaps_stdc_performance], 0),0),'########') STA_RENDIMIENTO,
                            [dbo].[get_max_students_dda](@idDda, @cityCode, ASIG_ID) NRO_ALUMNOS,
                            [dbo].[get_stock_ciudad](@idStock, [gaps_stdc_item_code], @cityCode, '%') STOCK,
                            [dbo].[get_stock_ciudad](@idStock, [gaps_stdc_item_code], @cityCode, 'IL') STOCK_IL
                        FROM (
                            SELECT 
                                [major_org_code]    AS INST
                                ,[prgd_major_code]   AS CARR_ID
                                ,[prgd_prog_code]    AS PLAN_ID
                                ,[prgd_level]        AS NIVEL
                                ,[cours_code]        AS ASIG_ID
                                ,[cours_description] AS ASIGNATURA
                                ,[cours_duration]    AS DURACION
                            FROM [dbo].[tbl_programs_grids]
                            JOIN [dbo].[tbl_majors] ON 
                                [major_code] = [prgd_major_code]
                            LEFT JOIN [dbo].[tbl_courses] ON 
                                [cours_org_code] = [major_org_code] 
                            AND [cours_code] = [prgd_cours_code]
                            WHERE [prgd_major_code] = coalesce(@majorCode,prgd_major_code) --'509' 
                                AND [prgd_prog_code] = coalesce(@progCode,prgd_prog_code)  --'10'
                                AND [prgd_level] > 0
                            ) MALLA
                            -- AQUI VA EL ESTANDAR HISTORIAL
                            LEFT JOIN [dbo].[tbl_gaps_source_standard] ON
                                [gaps_proc_id]  = @idStd --147 PKG_BRECHA_BIB.GET_DEFAULT_FUENTES_ID('STD')
                            AND [gaps_stdc_purc_code] = 'BIB' --?iAREA
                            AND [gaps_stdc_org_code] = MALLA.INST
                            AND [gaps_stdc_cours_code] = MALLA.ASIG_ID
                            --
                            LEFT JOIN [dbo].[tbl_items] ON
                                [item_purc_code] = [gaps_stdc_purc_code]
                            AND [item_code] = [gaps_stdc_item_code]
                        ) RES
                    ) RES2
                    ) RES3
                ) RES4 WHERE MAYOR = 1
                    ORDER BY
                        NIVEL ASC,ASIG_ID ASC;
      
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgCode',     sql.VarChar, orgCode ) 
                            .input('majorCode',   sql.VarChar, majorCode ) 
                            .input('progCode',    sql.VarChar, progCode )  
                            .input('cityCode',    sql.VarChar, cityCode )   
                            .input('idStd',       sql.VarChar, idStd )   
                            .input('idDda',       sql.VarChar, idDda )   
                            .input('idStock',     sql.VarChar, idStock )                                                      
                            .query(sqlGetBookCoverage);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Cobertura Bibliograficas encontradas' : 'No se encontro Cobertura Bibliograficas',
            bookCoverage: result?.recordset
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
module.exports.getBookCoverage = getBookCoverage;

const createStandard = async ( { 
    stdCode,
    stdOrgCode,
    stdBuCode,
    stdPurcCode,
    stdVersion,
    stdName,
    stdRegistrationDate,
    stdCaccCode,
    stdSchoCode,
    stdYear,
    stdStatus} ) => {
        
    let respuesta;
    try {
        
        const sqlCreateStandard = `
            INSERT INTO dbo.tbl_standards
                    (std_code
                    ,std_org_code
                    ,std_bu_code
                    ,std_purc_code
                    ,std_version
                    ,std_name
                    ,std_registration_date
                    ,std_cacc_code
                    ,std_scho_code
                    ,std_year
                    ,std_status)
            VALUES
                    (@stdCode
                    ,@stdOrgCode
                    ,@stdBuCode
                    ,@stdPurcCode
                    ,@stdVersion
                    ,@stdName
                    ,DBO.fncGetDate()
                    ,@stdCaccCode
                    ,@stdSchoCode
                    ,@stdYear
                    ,@stdStatus)        
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdCode',                   sql.VarChar,        stdCode )
                            .input('stdOrgCode',                sql.VarChar,        stdOrgCode )
                            .input('stdBuCode',                 sql.VarChar,        stdBuCode )
                            .input('stdPurcCode',               sql.VarChar,        stdPurcCode )
                            .input('stdVersion',                sql.Int,            stdVersion )
                            .input('stdName',                   sql.VarChar,        stdName )
                            .input('stdCaccCode',               sql.VarChar,        stdCaccCode )
                            .input('stdSchoCode',               sql.VarChar,        stdSchoCode )
                            .input('stdYear',                   sql.Int,            stdYear )
                            .input('stdStatus',                 sql.VarChar,        stdStatus   )    

                            .query(sqlCreateStandard);
        
        const affectedRows = result.rowsAffected[0];

        respuesta = {
            type: !affectedRows ? 'error' : 'ok',
            status: 200,
            message: 'Registro creado',
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
module.exports.createStandard = createStandard;

const updateStandard = async( 
    params,     
    stdCode,   
    stdPurcCode,
    stdVersion ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateStandard = `
        UPDATE dbo.tbl_standards 
           SET ${columnSet}
        WHERE
                std_code      = @stdCode
            and std_purc_code = @stdPurcCode
            and std_version   = @stdVersion
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdCode',     sql.VarChar, stdCode )
                            .input('stdPurcCode', sql.VarChar, stdPurcCode )
                            .input('stdVersion',  sql.Int, stdVersion )
                            .query(sqlUpdateStandard);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateStandard = updateStandard;

const deleteStandard = async ( 
    stdCode,   
    stdOrgCode,
    stdBuCode, 
    stdPurcCode,
    stdVersion
 ) => {
        
    try {
        
        const sqlDeleteStandard = `
            DELETE 
              FROM dbo.tbl_standards
             WHERE std_code      = @stdCode
               and std_org_code  = @stdOrgCode
               and std_bu_code   = @stdBuCode
               and std_purc_code = @stdPurcCode
               and std_version   = @stdVersion
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdCode',     sql.VarChar, stdCode )
                            .input('stdOrgCode',  sql.VarChar, stdOrgCode )
                            .input('stdBuCode',   sql.VarChar, stdBuCode )
                            .input('stdPurcCode', sql.VarChar, stdPurcCode )
                            .input('stdVersion',  sql.Int, stdVersion )
                            .query(sqlDeleteStandard);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteStandard = deleteStandard;

const enableDisableStandard = async ( 
    stdCode,   
    stdOrgCode,
    stdBuCode, 
    stdPurcCode,
    stdVersion,
    stdStatus
 ) => {
        
    try {
        
        const sqlEnableDisableStandard = `
            UPDATE dbo.tbl_standards
            SET std_status = @stdStatus
             WHERE std_code      = @stdCode
               and std_org_code  = @stdOrgCode
               and std_bu_code   = @stdBuCode
               and std_purc_code = @stdPurcCode
               and std_version   = @stdVersion
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdStatus',   sql.VarChar, stdStatus )
                            .input('stdCode',     sql.VarChar, stdCode )
                            .input('stdOrgCode',  sql.VarChar, stdOrgCode )
                            .input('stdBuCode',   sql.VarChar, stdBuCode )
                            .input('stdPurcCode', sql.VarChar, stdPurcCode )
                            .input('stdVersion',  sql.Int, stdVersion )
                            .query(sqlEnableDisableStandard);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.enableDisableStandard = enableDisableStandard;

