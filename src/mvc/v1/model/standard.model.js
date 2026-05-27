
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const standardExists = async ( standardCode, standardOrgCode, standardBuCode, standardPurcCode, standardVersion) => {

    let respuesta;
    try {
        const sqlStandardExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                SELECT 'Estandar ya existe.'  AS  validacion,
                        count(*) AS total
                    FROM tbl_standards t1
                WHERE t1.std_code          =   $1
                    AND t1.std_org_code    =   $2
                    AND t1.std_bu_code     =   $3
                    AND t1.std_purc_code   =   $4
                    AND t1.std_version     =    $5
                ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlStandardExists, [standardCode, standardOrgCode, standardBuCode, standardPurcCode, standardVersion]);

        respuesta = {
            type: result?.rows[0].validacion ? 'error' : 'ok',
            status: 200,
            message: result?.rows[0].validacion,
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
                    ,t1.std_purc_code              AS "stdPurcCode"               
                    ,t7.purc_description		   AS "stdPurcDescription"		
                    ,t1.std_name				   AS "stdName"				
                    ,t1.std_code				   AS "stdCode"				
                    ,t1.std_bu_code				   AS "stdBuCode"				
                    ,t1.std_bu_code          	   AS "stdBuName"	
                    ,t1.std_org_code			   AS "stdOrgCode"			
                    ,t3.org_description			   AS "stdOrgDescription"			
                    ,t4.cacc_description		   AS "stdCaccDescription"		
                    ,t4.cacc_code				   AS "stdCaccCode"				
                    ,t5.scho_description		   AS "stdSchoDescription"		
                    ,t5.scho_code				   AS "stdSchoCode"				
                    ,t1.std_registration_date	   AS "stdRegistrationDate"	
                    ,t1.std_year				   AS "stdYear"				
                    ,t1.std_version				   AS "stdVersion"	
                    ,COALESCE(t1.std_available_for_purchase, 'N') AS "stdAvailableForPurchase" 			
                    ,t1.std_status                 AS "stdStatus"              
               FROM tbl_standards t1
                JOIN tbl_users_business_units t2
                    ON t2.usbu_bu_code     =   t1.std_bu_code
                    AND t2.usbu_user_id     =   $1
                    AND t2.usbu_bu_code     =   $2
                    AND t2.usbu_status      =   'S'
                LEFT JOIN tbl_organizations t3
                        ON t3.org_code         =   t1.std_org_code
                LEFT JOIN tbl_charge_account t4
                        ON t4.cacc_code        =   t1.std_cacc_code
                LEFT JOIN tbl_schools t5
                        ON t5.scho_org_code    =   t1.std_org_code
                        AND scho_code           =   t1.std_scho_code
                JOIN tbl_users_charge_accounts t6
                        ON t6.ucac_user_id     =   $1
                        AND t6.ucac_purc_code   =   t1.std_purc_code
                        AND t6.ucac_cacc_code   =   t1.std_cacc_code
                JOIN tbl_purchase_areas t7
                        ON t7.purc_code        =   t1.std_purc_code
                        AND t7.purc_status      =   'S'
            WHERE t1.std_purc_code    =   $3
                        AND t5.scho_description IS NOT NULL
            ORDER BY t1.std_code,
                    t1.std_year DESC,
                    t1.std_version DESC
        `;

        const result = await pool.query(sqlGetAllStandards, [userId, businessUnitCode, purchaseAreaCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Estandares encontrados' : 'No se encontraron Estandares',
            standards: result?.rows
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
                    ,t1.std_code                  AS "stdCode"                
                    ,t1.std_org_code              AS "stdOrgCode"            
                    ,t2.org_description			  AS "orgDescription"			
                    ,t1.std_bu_code				  AS "stdBuCode"				
                    ,t1.std_purc_code			  AS "stdPurcCode"			
                    ,t1.std_version				  AS "stdVersion"				
                    ,t1.std_name				  AS "stdName"				
                    ,t1.std_registration_date	  AS "stdRegistrationDate"	
                    ,t1.std_cacc_code			  AS "stdCaccCode"			
                    ,t3.cacc_description		  AS "stdCaccDescription"		
                    ,t1.std_scho_code			  AS "stdSchoCode"			
                    ,t4.scho_description		  AS "stdSchoDescription"		
                    ,t1.std_year                  AS "stdYear"
                    ,COALESCE(t1.std_available_for_purchase, 'N') AS "stdAvailableForPurchase"
                    ,t1.std_status AS "stdStatus"
            FROM tbl_standards t1
                LEFT JOIN tbl_organizations t2 ON t2.org_code = t1.std_org_code
                LEFT JOIN tbl_charge_account t3 ON t3.cacc_code = t1.std_cacc_code AND t3.cacc_org_code = t2.org_code
                LEFT JOIN tbl_schools t4 ON t4.scho_code = t1.std_scho_code and t4.scho_org_code = t1.std_org_code
                LEFT JOIN tbl_users_business_units t5 ON  t5.usbu_bu_code = t1.std_bu_code 
                LEFT JOIN tbl_users_charge_accounts t6 ON  t6.ucac_cacc_code = t1.std_cacc_code AND t6.ucac_purc_code = t1.std_purc_code
            WHERE
                        t1.std_code      = $1
                    AND t1.std_org_code  = $2
                    AND t1.std_bu_code   = $3
                    AND t1.std_purc_code = $4
                    AND t1.std_year      = $5
                    AND t1.std_version   = $6
                    AND t5.usbu_user_id  = $7
                    AND t6.ucac_user_id  = $7 
                    AND t5.usbu_bu_code  = $3
                    AND t4.scho_description IS NOT NULL
            ORDER BY  t1.std_code
        `;

        const result = await pool.query(sqlGetStandardByKey, [stdCode, stdOrgCode, stdBuCode, stdPurcCode, stdYear, stdVersion, stdUserId]);
        
        return result?.rows[0];
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
        SELECT ROW_NUMBER() OVER(ORDER BY  t1."stdCode" ASC) AS id, t1.* FROM (
            SELECT DISTINCT 
                    --ROW_NUMBER() OVER(ORDER BY  t1.std_code ASC) AS id
                  t1.std_code                  AS "stdCode"                
                 ,t1.std_org_code              AS "stdOrgCode"            
                 ,t2.org_description		   AS "orgDescription"			
                 ,t1.std_bu_code			   AS "stdBuCode"				
                 ,t1.std_purc_code			   AS "stdPurcCode"			
                 ,t1.std_version			   AS "stdVersion"				
                 ,t1.std_name				   AS "stdName"				
                 ,t1.std_registration_date	   AS "stdRegistrationDate"	
                 ,t1.std_cacc_code			   AS "stdCaccCode"			
                 ,t3.cacc_description		   AS "stdCaccDescription"		
                 ,t1.std_scho_code			   AS "stdSchoCode"			
                 ,t4.scho_description		   AS "stdSchoDescription"		
                 ,t1.std_year                  AS "stdYear"
                 ,COALESCE(t1.std_available_for_purchase, 'N') AS "stdAvailableForPurchase"
                 ,t1.std_status AS "stdStatus"
                 ,'[' || CAST(t1.std_version AS VARCHAR) || ']' || t1.std_name  AS "stdOptionLabel"
            FROM tbl_standards t1
            LEFT JOIN tbl_organizations t2 ON t2.org_code = t1.std_org_code
            LEFT JOIN tbl_charge_account t3 ON t3.cacc_code = t1.std_cacc_code AND t3.cacc_org_code = t2.org_code
            LEFT JOIN tbl_schools t4 ON t4.scho_code = t1.std_scho_code and t4.scho_org_code = t1.std_org_code
            LEFT JOIN tbl_users_business_units t5 ON  t5.usbu_bu_code = t1.std_bu_code 
            LEFT JOIN tbl_users_charge_accounts t6 ON  t6.ucac_cacc_code = t1.std_cacc_code AND t6.ucac_purc_code = t1.std_purc_code
            WHERE
                    t1.std_code      = COALESCE($1,t1.std_code)
                AND t1.std_org_code  = COALESCE($2,t1.std_org_code)
                AND t1.std_bu_code   = COALESCE($3,t1.std_bu_code)
                AND t1.std_purc_code = COALESCE($4,t1.std_purc_code)
                AND t1.std_year      = COALESCE($5,t1.std_year)
                AND t1.std_version   = COALESCE($6,t1.std_version)
                AND t5.usbu_user_id  = COALESCE($8, t5.usbu_user_id)
                AND t6.ucac_user_id  = COALESCE($8, t6.ucac_user_id)
                AND t5.usbu_bu_code  = COALESCE($3,t5.usbu_bu_code)
                AND t1.std_available_for_purchase  = COALESCE($7,t1.std_available_for_purchase)
                AND t4.scho_description IS NOT NULL
                --ORDER BY  t1.std_code 
                ) t1
                ORDER BY  t1."stdCode" 
        `;

        const result = await pool.query(sqlGetStandardBySearch, [stdCode, stdOrgCode, stdBuCode, stdPurcCode, stdYear, stdVersion, stdPurchase, stdUserId]);
        
            respuesta = {
                type: 'ok',
                status: 200,
                message: result?.rows.length > 0 ? 'Estandares encontrados' : 'No se encontraron Estandares',
                standards: result?.rows
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
             major_org_code         AS "majorOrgCode"
            ,prgd_major_code        AS "prgdMajorCode"
            ,prgd_prog_code         AS "prgdProgCode"
            ,prgd_level             AS "prgdLevel"
            ,cours_code             AS "coursCode"
            ,cours_description      AS "coursDescription"
            ,case cours_duration when 'A' then 'Anual'
                            when 'M' then 'Mensual'
                            when 'O' then 'Otros'
                            when 'S' then 'Semestral'
                            when 'T' then 'Trimestral'
                                    else 'N/E'
             end                     AS "coursDuration"
            ,stdc_item_code          AS "stdcItemCode"
            ,item_description        AS "itemDescription"
            ,stdc_performance        AS "stdcPerformance"
            ,item_unit_value         AS "itemUnitValue"
            ,stdc_maintenance_cicle  AS "stdcMaintenanceCicle"
            ,stdc_renewal_cicle      AS "stdcRenewalCicle"
            ,stdc_rlay_code          AS "stdcRlayCode"
            ,rlay_rlat_code          AS "stdcRlatCode"
            ,rlay_description        AS "rlayDescription"
        from
                tbl_programs_grids
            join tbl_majors on
                major_code = prgd_major_code 
            left join tbl_courses on
                cours_org_code = major_org_code
            and cours_code = prgd_cours_code
            join tbl_standards_courses on
                stdc_bu_code     = $2
            and stdc_std_code    = $4
            and stdc_purc_code   = $1
            and stdc_std_version = $5
            and stdc_org_code    = cours_org_code
            and stdc_cours_code  = cours_code
            left join tbl_items on
                item_code        = stdc_item_code
            left join tbl_rooms_layout on
                       rlay_code = stdc_rlay_code
        where
                prgd_major_code = $3
            and prgd_level > 0
            and stdc_status = 'S';
        `;

        const result = await pool.query(sqlGetStandardApplieToMajor, [purcCode, buCode, majorCode, stdCode, stdVersion]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Estandares Aplicadoa a Carrera encontrados' : 'No se encontraron Estandares Aplicadoa a Carrera',
            standardsAppliedToMajor: result?.rows
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
         SELECT rlay_code AS "rlayCode",
                rlay_description AS "rlayDescription",
                item_code AS "itemCode",
                item_description AS "itemDescription",
                cours_code AS "coursCode",
                cours_description AS "coursDescription",
                CASE cours_duration WHEN 'A' THEN 'Anual'
                                WHEN 'M' THEN 'Mensual'
                                WHEN 'O' THEN 'Otros'
                                WHEN 'S' THEN 'Semestral'
                                WHEN 'T' THEN 'Trimestral'
                                        ELSE 'N/E'
                END AS "coursDuration",
                stdc_performance AS "stdcPerformance",
                coalesce (stdc_performance, 0, 0, ROUND (rlay_capacity / stdc_performance, 0)) AS "quantity",
                item_unit_value AS "itemUnitValue",
                item_unit_value * coalesce (stdc_performance, 0, 0, ROUND (100 / stdc_performance, 1)) AS "investment",
                stdc_maintenance_cicle AS "stdcMaintenance",
                stdc_renewal_cicle AS "stdcRenewalCicle"
        FROM tbl_standards_courses t1
                JOIN tbl_rooms_layout t2
                ON rlay_code = stdc_rlay_code
                LEFT JOIN tbl_items t3
                ON item_code = stdc_item_code
                LEFT JOIN tbl_courses
                ON     cours_org_code = stdc_org_code
                    AND cours_code = stdc_cours_code
        WHERE     stdc_bu_code LIKE $2
                AND stdc_std_code LIKE $4
                AND stdc_std_version = $5
                AND stdc_rlay_code LIKE $3
                AND stdc_purc_code = $1
        ORDER BY stdc_rlay_code, stdc_item_code, stdc_cours_code;
        `;

        const result = await pool.query(sqlGetStandardApplieToRoomLayout, [purcCode, buCode, rlayCode, stdCode, stdVersion]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Estandares Aplicadoa a Recintos Prototipo encontrados' : 'No se encontraron Estandares Aplicadoa a Recintos Prototipos',
            standardsAppliedToRoomLayout: result?.rows
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
            stdc_purc_code AS "stdcPurcCode",
            stdc_item_code AS "stdcItemCode",
            item_description AS "stdcItemDescription",
            coalesce(stdc_performance, 0) AS "stdcPerformance",
            100 AS "stdcStudents",
            CASE
            WHEN (stdc_performance = 0) OR (stdc_performance IS NULL) THEN 0
            WHEN rlay_capacity > 0 THEN ROUND( rlay_capacity / stdc_performance, 0 )
            ELSE
                --ROUND( PNALUMNOS / STA_RENDIMIENTO, 1 )
                ROUND( 100 / stdc_performance, 0 )
            END AS "quantity",
            item_unit_value AS "stdcItemUnitValue",
            CASE
            WHEN stdc_performance = 0 THEN 0
            WHEN rlay_capacity > 0 THEN item_unit_value * ROUND( rlay_capacity / stdc_performance, 0 )
            ELSE
                item_unit_value * ROUND( 100 / stdc_performance, 0 )
            END AS "stdcInvestment",
            stdc_maintenance_cicle AS "stdcMaintenanceCicle",
            stdc_renewal_cicle AS "stdcRenewalCicle",
            stdc_rlay_code AS "stdRlayCode",
            coalesce(rlay_capacity, 0) AS "rlayCapacity",
            rlay_description AS "stdcRlayDescription"   
        FROM (
            SELECT
            t02.major_org_code    AS "majorOrgCode",
            t01.prgd_major_code   AS "majorCode",
            t01.prgd_prog_code    AS "prgdCode",
            t01.prgd_level        AS "prgdLevel",
            t03.cours_code        AS "coursCode",
            t03.cours_description AS "courseDescription",
            t03.cours_duration    AS "coursDuration"
            FROM
                    tbl_programs_grids t01
            JOIN tbl_majors t02 ON
                t02.major_code = t01.prgd_major_code
            LEFT JOIN tbl_courses t03 ON
                t03.cours_org_code = t02.major_org_code
            AND t03.cours_code = t01.prgd_cours_code
            WHERE
                t01.prgd_major_code = $1
            AND t01.prgd_prog_code = $2
            AND t01.prgd_level > 0
            ) grid
            --LEFT
            JOIN tbl_standards_courses t01 ON
                t01.stdc_purc_code LIKE $3
            AND t01.stdc_org_code = grid."majorOrgCode"
            AND t01.stdc_cours_code = grid."coursCode"
            AND t01.stdc_status = 'S'
            LEFT JOIN tbl_items t02 ON
                t02.item_purc_code = t01.stdc_purc_code
            AND t02.item_code = t01.stdc_item_code
            LEFT JOIN tbl_rooms_layout t03 ON
                t03.rlay_code = t01.stdc_rlay_code
        ORDER BY
            stdc_org_code,
            stdc_cours_code,
            grid."prgdCode",
            grid."prgdLevel",
            grid."coursCode";
        `;

        const result = await pool.query(sqlGetStandardEquipmentByMajor, [majorCode, progCode, purcCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Equipamiento de Carrera encontrados' : 'No se encontraron Equipamiento de Carrera',
            standardsEquipmentByMajor: result?.rows
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
                    INST                  AS "orgCode",
                    CARR_ID               AS "majorCode",
                    PLAN_ID               AS "progCode",
                    NIVEL                 AS "levelCode",
                    ASIG_ID               AS "coursCode",
                    ASIGNATURA            AS "coursDescription",
                    STA_CBI_CODIGO        AS "itemCode",
                    CBI_DESCRIPCION       AS "itemDescripcion",
                    STA_RENDIMIENTO       AS "stdPerformance",
                    NRO_ALUMNOS           AS "studentQty",
                    STOCK                 AS stock,
                    STOCK_IL              AS "stockUnlimited",
                    DEMANDA               AS demand,
                    CUMPLIM_TIT           AS "coverageTit",
                    TIENE_STK_IL          AS "haveStockUnlimited",
                    CUMPLIM_REND          AS "coveragePerformance",
                    CUMPLIM_REND_AJUSTADO AS "coveragePerformanceAdjusted",
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
                    $4 CIUDAD
                FROM(
                    SELECT
                        RES.*,
                        CASE
                            WHEN STA_CBI_CODIGO IS NULL AND NRO_ALUMNOS = 1 THEN 1
                            WHEN STA_CBI_CODIGO IS NULL AND NRO_ALUMNOS > 0 AND INST = 'UNV' THEN FORMAT(ROUND(get_round_minus05(NRO_ALUMNOS/10),0),'#########')
                            WHEN STA_CBI_CODIGO IS NULL AND NRO_ALUMNOS > 0 AND INST <> 'UNV' THEN FORMAT(ROUND(get_round_minus05(NRO_ALUMNOS/20),0), '#########')
                            WHEN STOCK_IL > 0 AND NRO_ALUMNOS > 0 THEN NRO_ALUMNOS
                            WHEN (STA_RENDIMIENTO = 0) OR (STA_RENDIMIENTO IS NULL) THEN 0
                            WHEN NRO_ALUMNOS = 0 AND STOCK > 0 THEN 0 
                            WHEN NRO_ALUMNOS = 0 THEN STOCK
                            ELSE
                            FORMAT(ROUND(get_round_minus05(NRO_ALUMNOS / STA_RENDIMIENTO),0),'#########')
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
                            gaps_stdc_purc_code STA_ACO_CODIGO,
                            gaps_stdc_item_code STA_CBI_CODIGO,
                            item_description    CBI_DESCRIPCION,
                            FORMAT(ROUND(COALESCE(gaps_stdc_performance, 0),0),'########') STA_RENDIMIENTO,
                            get_max_students_dda($6, $4, ASIG_ID) NRO_ALUMNOS,
                            get_stock_ciudad($7, gaps_stdc_item_code, $4, '%') STOCK,
                            get_stock_ciudad($7, gaps_stdc_item_code, $4, 'IL') STOCK_IL
                        FROM (
                            SELECT 
                                major_org_code    AS "INST"
                                ,prgd_major_code   AS CARR_ID
                                ,prgd_prog_code    AS PLAN_ID
                                ,prgd_level        AS "NIVEL"
                                ,cours_code        AS ASIG_ID
                                ,cours_description AS "ASIGNATURA"
                                ,cours_duration    AS "DURACION"
                            FROM tbl_programs_grids
                            JOIN tbl_majors ON 
                                major_code = prgd_major_code
                            LEFT JOIN tbl_courses ON 
                                cours_org_code = major_org_code 
                            AND cours_code = prgd_cours_code
                            WHERE prgd_major_code = coalesce($2,prgd_major_code) --'509' 
                                AND prgd_prog_code = coalesce($3,prgd_prog_code)  --'10'
                                AND prgd_level > 0
                            ) MALLA
                            -- AQUI VA EL ESTANDAR HISTORIAL
                            LEFT JOIN tbl_gaps_source_standard ON
                                gaps_proc_id  = $5 --147 PKG_BRECHA_BIB.GET_DEFAULT_FUENTES_ID('STD')
                            AND gaps_stdc_purc_code = 'BIB' --?iAREA
                            AND gaps_stdc_org_code = MALLA.INST
                            AND gaps_stdc_cours_code = MALLA.ASIG_ID
                            --
                            LEFT JOIN tbl_items ON
                                item_purc_code = gaps_stdc_purc_code
                            AND item_code = gaps_stdc_item_code
                        ) RES
                    ) RES2
                    ) RES3
                ) RES4 WHERE MAYOR = 1
                    ORDER BY
                        NIVEL ASC,ASIG_ID ASC;
      
        `;

        const result = await pool.query(sqlGetBookCoverage, [orgCode, majorCode, progCode, cityCode, idStd, idDda, idStock]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Cobertura Bibliograficas encontradas' : 'No se encontro Cobertura Bibliograficas',
            bookCoverage: result?.rows
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
            INSERT INTO tbl_standards
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
                    ($1
                    ,$2
                    ,$3
                    ,$4
                    ,$5
                    ,$6
                    ,NOW()
                    ,$7
                    ,$8
                    ,$9
                    ,$10)        
        `;

        const result = await pool.query(sqlCreateStandard, [stdCode, stdOrgCode, stdBuCode, stdPurcCode, stdVersion, stdName, stdCaccCode, stdSchoCode, stdYear, stdStatus]);
        
        const affectedRows = result.rowCount;

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
        UPDATE tbl_standards 
           SET ${columnSet}
        WHERE
                std_code      = $1
            and std_purc_code = $2
            and std_version   = $3
        `;

        const result = await pool.query(sqlUpdateStandard, [stdCode, stdPurcCode, stdVersion]);
        
        return result?.rowCount;
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
              FROM tbl_standards
             WHERE std_code      = $1
               and std_org_code  = $2
               and std_bu_code   = $3
               and std_purc_code = $4
               and std_version   = $5
        `;

        const result = await pool.query(sqlDeleteStandard, [stdCode, stdOrgCode, stdBuCode, stdPurcCode, stdVersion]);
        
        const affectedRows = result.rowCount;

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
            UPDATE tbl_standards
            SET std_status = $1
             WHERE std_code      = $2
               and std_org_code  = $3
               and std_bu_code   = $4
               and std_purc_code = $5
               and std_version   = $6
        `;

        const result = await pool.query(sqlEnableDisableStandard, [stdStatus, stdCode, stdOrgCode, stdBuCode, stdPurcCode, stdVersion]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.enableDisableStandard = enableDisableStandard;

