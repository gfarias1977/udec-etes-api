const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const standardCourseExist = async ( stdcStdCode, stdcOrgCode, stdcBuCode, stdcStdVersion, stdcCoursCode, stdcRlayCode, stdcPurcCode,stdcItemCode,stdcSchoCode ) => {

    let respuesta;
    try {
        const sqlStandardCourseExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
            FROM (
                SELECT 'Estandar Asignatura ya existe.'  AS  validacion,
                        count(*) AS total
                    FROM tbl_standards_courses t1
                WHERE   t1.stdc_std_code      =   @stdcStdCode
                    AND t1.stdc_org_code      =   @stdcOrgCode
                    AND t1.stdc_bu_code       =   @stdcBuCode
                    AND t1.stdc_std_version   =   @stdcStdVersion
                    AND t1.stdc_cours_code    =   @stdcCoursCode
                    AND t1.stdc_rlay_code     =   @stdcRlayCode
                    AND t1.stdc_purc_code     =   @stdcPurcCode
                    AND t1.stdc_item_code     =   @stdcItemCode
                    AND t1.stdc_scho_code     =   @stdcSchoCode
                ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdcStdCode',     sql.VarChar, stdcStdCode     )
                            .input('stdcOrgCode',     sql.VarChar, stdcOrgCode     )
                            .input('stdcBuCode',      sql.VarChar, stdcBuCode      )
                            .input('stdcStdVersion',  sql.Int,     stdcStdVersion  )
                            .input('stdcCoursCode',   sql.VarChar, stdcCoursCode   )
                            .input('stdcRlayCode',    sql.VarChar, stdcRlayCode    )
                            .input('stdcPurcCode',    sql.VarChar, stdcPurcCode    )
                            .input('stdcItemCode',    sql.Int,     stdcItemCode    )
                            .input('stdcSchoCode',    sql.VarChar, stdcSchoCode    )
                            .query(sqlStandardCourseExist);

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
module.exports.standardCourseExist = standardCourseExist;

const getAllStandardCourses = async( ) => {

    let respuesta;
    try {
        const sqlGetAllStandardCourses = `
                SELECT        
                    ROW_NUMBER() OVER(ORDER BY  t1.stdc_std_code ASC) AS id
                    ,t1.stdc_std_code                 AS    stdcStdCode               
                    ,t1.stdc_org_code				  AS 	stdcOrgCode				
                    ,t3.org_description				  AS 	stdcOrgDescription				
                    ,t1.stdc_bu_code				  AS 	stdcBuCode				
                    ,t2.bu_name						  AS 	stdcBuName						
                    ,t1.stdc_std_version			  AS 	stdcStdVersion			
                    ,t1.stdc_cours_code				  AS 	stdcCoursCode				
                    ,t4.cours_description			  AS 	stdcCoursDescription			
                    ,t1.stdc_rlay_code				  AS 	stdcRlayCode				
                    ,t6.rlay_description			  AS 	stdcRlayDescription			
                    ,t1.stdc_purc_code				  AS 	stdcPurcCode				
                    ,t7.purc_name					  AS 	stdcPurcName					
                    ,t1.stdc_item_code				  AS 	stdcItemCode				
                    ,t8.item_description			  AS 	stdcItemDescription			
                    ,t9.itmc_name					  AS 	stdcItmcName					
                    ,t10.itmc_name              	  AS 	stdcItmcParent	
                    ,t1.stdc_scho_code				  AS 	stdcSchoCode				
                    ,t5.scho_description			  AS 	stdcSchoDescription			
                    ,t1.stdc_performance			  AS 	stdcPerformance			
                    ,t1.stdc_renewal_cicle			  AS 	stdcRenewalCicle			
                    ,t1.stdc_maintenance_cicle		  AS 	stdcMaintenanceCicle		
                    ,t1.stdc_detail					  AS 	stdcDetail					
                    ,t1.stdc_status					  AS 	stdcStatus	
                FROM
                        dbo.tbl_standards_courses t1
                        JOIN dbo.tbl_business_units t2 ON
                                t2.bu_code     = t1.stdc_bu_code
                            AND t2.bu_status = 'S'
                        LEFT JOIN dbo.tbl_organizations t3 ON
                                t3.org_code = t1.stdc_org_code
                        LEFT JOIN dbo.tbl_courses t4 ON
                                t4.cours_code = t1.stdc_cours_code
                            AND t4.cours_org_code = t1.stdc_org_code
                        LEFT JOIN dbo.tbl_schools t5 ON
                                t5.scho_org_code = t1.stdc_org_code
                            AND t5.scho_code = t1.stdc_scho_code
                        LEFT JOIN dbo.tbl_rooms_layout t6 ON
                                t6.rlay_code = t1.stdc_rlay_code
                        LEFT JOIN dbo.tbl_purchase_areas t7 ON
                                t7.purc_code = t1.stdc_purc_code
                        LEFT JOIN dbo.tbl_items t8 ON
                                t8.item_code = t1.stdc_item_code
                            AND t8.item_purc_code = t1.stdc_purc_code
                        LEFT JOIN dbo.tbl_item_categories t9 ON
                                t9.itmc_code = t8.item_itmc_code 
                        LEFT JOIN dbo.tbl_item_categories t10 ON
                                t10.itmc_code = t9.itmc_parent_code
                ORDER BY  t1.stdc_std_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllStandardCourses);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Estandares encontrados' : 'No se encontraron Estandares',
            standardCourses: result?.recordset
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
module.exports.getAllStandardCourses = getAllStandardCourses;


const getAllStandardCoursesByUserId = async( stdcUserId, stdcStdCode, stdcPurcCode, stdcVersion ) => {

    let respuesta;
    try {
        const sqlGetAllStandardCourses = `
                SELECT        
                    ROW_NUMBER() OVER(ORDER BY  t1.stdc_std_code ASC) AS id
                    ,t1.stdc_std_code                 AS    stdcStdCode               
                    ,t1.stdc_org_code				  AS 	stdcOrgCode				
                    ,t3.org_description				  AS 	stdcOrgDescription				
                    ,t1.stdc_bu_code				  AS 	stdcBuCode				
                    ,t2.bu_name						  AS 	stdcBuName						
                    ,t1.stdc_std_version			  AS 	stdcStdVersion			
                    ,t1.stdc_cours_code				  AS 	stdcCoursCode				
                    ,t4.cours_description			  AS 	stdcCoursDescription			
                    ,t1.stdc_rlay_code				  AS 	stdcRlayCode				
                    ,t6.rlay_description			  AS 	stdcRlayDescription			
                    ,t1.stdc_purc_code				  AS 	stdcPurcCode				
                    ,t7.purc_name					  AS 	stdcPurcName					
                    ,t1.stdc_item_code				  AS 	stdcItemCode				
                    ,t8.item_description			  AS 	stdcItemDescription			
                    ,t9.itmc_name					  AS 	stdcItmcName					
                    ,t10.itmc_name              	  AS 	stdcItmcParent	
                    ,t1.stdc_scho_code				  AS 	stdcSchoCode				
                    ,t5.scho_description			  AS 	stdcSchoDescription			
                    ,t1.stdc_performance			  AS 	stdcPerformance			
                    ,t1.stdc_renewal_cicle			  AS 	stdcRenewalCicle			
                    ,t1.stdc_maintenance_cicle		  AS 	stdcMaintenanceCicle		
                    ,t1.stdc_detail					  AS 	stdcDetail					
                    ,t1.stdc_status					  AS 	stdcStatus	
                FROM
                        dbo.tbl_standards_courses t1
                        JOIN dbo.tbl_business_units t2 ON
                                t2.bu_code     = t1.stdc_bu_code
                            AND t2.bu_status = 'S'
                        LEFT JOIN dbo.tbl_organizations t3 ON
                                t3.org_code = t1.stdc_org_code
                        LEFT JOIN dbo.tbl_courses t4 ON
                                t4.cours_code = t1.stdc_cours_code
                            AND t4.cours_org_code = t1.stdc_org_code
                        LEFT JOIN dbo.tbl_schools t5 ON
                                t5.scho_org_code = t1.stdc_org_code
                            AND t5.scho_code = t1.stdc_scho_code
                        LEFT JOIN dbo.tbl_rooms_layout t6 ON
                                t6.rlay_code = t1.stdc_rlay_code
                        LEFT JOIN dbo.tbl_purchase_areas t7 ON
                                t7.purc_code = t1.stdc_purc_code
                        LEFT JOIN dbo.tbl_items t8 ON
                                t8.item_code = t1.stdc_item_code
                            AND t8.item_purc_code = t1.stdc_purc_code
                        LEFT JOIN dbo.tbl_item_categories t9 ON
                                t9.itmc_code = t8.item_itmc_code 
                        LEFT JOIN dbo.tbl_item_categories t10 ON
                                t10.itmc_code = t9.itmc_parent_code
                    WHERE
                            t1.stdc_std_code    = @stdcStdCode
                        and t1.stdc_std_version = @stdcVersion
                        and t1.stdc_purc_code   = COALESCE(@stdcPurcCode, t1.stdc_purc_code)
                        and t1.stdc_purc_code in 
                        (
                            SELECT uspa_purc_code FROM tbl_users_purchase_areas t01
                            JOIN tbl_purchase_areas t02 ON t02.purc_code = t01.uspa_purc_code
                            AND t01.uspa_user_id = @stdcUserId
                    
                        )
                    ORDER BY  t1.stdc_std_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdcUserId',   sql.Int,     stdcUserId   )
                            .input('stdcStdCode',  sql.VarChar, stdcStdCode  )
                            .input('stdcVersion',  sql.Int,     stdcVersion  )
                            .input('stdcPurcCode', sql.VarChar, stdcPurcCode )
                            .query(sqlGetAllStandardCourses);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Estandares encontrados' : 'No se encontraron Estandares',
            standardCourses: result?.recordset
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
module.exports.getAllStandardCoursesByUserId = getAllStandardCoursesByUserId;


const getStandardCourseById = async( 
    stdcStdCode,
    stdcOrgCode,
    stdcBuCode,
    stdcPurcCode,
    stdcCoursCode,
    stdcRlayCode,
    stdcItemCode,
    stdcVersion,
    stdcSchoCode) => {

    try {
        
        const sqlGetAllStandardCoursesByUserId = `
            SELECT
                 ROW_NUMBER() OVER(ORDER BY  t1.stdc_std_code ASC) AS id
                 ,t1.stdc_std_code                 AS    stdcStdCode               
                 ,t1.stdc_org_code				  AS 	stdcOrgCode				
                 ,t3.org_description				  AS 	stdcOrgDescription				
                 ,t1.stdc_bu_code				  AS 	stdcBuCode				
                 ,t2.bu_name						  AS 	stdcBuName						
                 ,t1.stdc_std_version			  AS 	stdcStdVersion			
                 ,t1.stdc_cours_code				  AS 	stdcCoursCode				
                 ,t4.cours_description			  AS 	stdcCoursDescription			
                 ,t1.stdc_rlay_code				  AS 	stdcRlayCode				
                 ,t6.rlay_description			  AS 	stdcRlayDescription			
                 ,t1.stdc_purc_code				  AS 	stdcPurcCode				
                 ,t7.purc_name					  AS 	stdcPurcName					
                 ,t1.stdc_item_code				  AS 	stdcItemCode				
                 ,t8.item_description			  AS 	stdcItemDescription			
                 ,t9.itmc_name					  AS 	stdcItmcName					
                 ,t10.itmc_name              	  AS 	stdcItmcParent	
                 ,t1.stdc_scho_code				  AS 	stdcSchoCode				
                 ,t5.scho_description			  AS 	stdcSchoDescription			
                 ,t1.stdc_performance			  AS 	stdcPerformance			
                 ,t1.stdc_renewal_cicle			  AS 	stdcRenewalCicle			
                 ,t1.stdc_maintenance_cicle		  AS 	stdcMaintenanceCicle		
                 ,t1.stdc_detail					  AS 	stdcDetail					
                 ,t1.stdc_status					  AS 	stdcStatus	
            FROM
                    dbo.tbl_standards_courses t1
                    JOIN dbo.tbl_business_units t2 ON
                            t2.bu_code     = t1.stdc_bu_code
                        AND t2.bu_status = 'S'
                    LEFT JOIN dbo.tbl_organizations t3 ON
                            t3.org_code = t1.stdc_org_code
                    LEFT JOIN dbo.tbl_courses t4 ON
                            t4.cours_code = t1.stdc_cours_code
                        AND t4.cours_org_code = t1.stdc_org_code
                    LEFT JOIN dbo.tbl_schools t5 ON
                            t5.scho_org_code = t1.stdc_org_code
                        AND t5.scho_code = t1.stdc_scho_code
                    LEFT JOIN dbo.tbl_rooms_layout t6 ON
                            t6.rlay_code = t1.stdc_rlay_code
                    LEFT JOIN dbo.tbl_purchase_areas t7 ON
                            t7.purc_code = t1.stdc_purc_code
                    LEFT JOIN dbo.tbl_items t8 ON
                            t8.item_code = t1.stdc_item_code
                        AND t8.item_purc_code = t1.stdc_purc_code
                    LEFT JOIN dbo.tbl_item_categories t9 ON
                            t9.itmc_code = t8.item_itmc_code 
                    LEFT JOIN dbo.tbl_item_categories t10 ON
                            t10.itmc_code = t9.itmc_parent_code
            WHERE
                        t1.stdc_std_code    = @stdcStdCode
                    and t1.stdc_org_code    = @stdcOrgCode
                    and t1.stdc_bu_code     = @stdcBuCode
                    and t1.stdc_std_version = @stdcVersion
                    and t1.stdc_cours_code  = @stdcCoursCode
                    and t1.stdc_rlay_code   = @stdcRlayCode
                    and t1.stdc_purc_code   = @stdcPurcCode
                    and t1.stdc_item_code   = @stdcItemCode
                    and t1.stdc_scho_code   = @stdcSchoCode
            ORDER BY  t1.stdc_std_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdcStdCode',    sql.VarChar, stdcStdCode   )
                            .input('stdcOrgCode',    sql.VarChar, stdcOrgCode   )
                            .input('stdcBuCode',     sql.VarChar, stdcBuCode   )
                            .input('stdcPurcCode',   sql.VarChar, stdcPurcCode  )
                            .input('stdcCoursCode',  sql.VarChar, stdcCoursCode )
                            .input('stdcRlayCode',   sql.VarChar, stdcRlayCode  )
                            .input('stdcItemCode',   sql.Int,     stdcItemCode  )
                            .input('stdcVersion',    sql.Int,     stdcVersion   )
                            .input('stdcSchoCode',   sql.VarChar, stdcSchoCode  )
                            .query(sqlGetAllStandardCoursesByUserId);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getStandardCourseById = getStandardCourseById;


const getStandardCourseByStandardUserId = async( 
    stdcStdCode,
    stdcOrgCode,
    stdcBuCode,
    stdcPurcCode,
    stdcVersion,
    stdcYear,
    stdcUserId ) => {

    try {
        
        const sqlGetAllStandardCoursesByUserId = `
        WITH tbl_rlay_courses as (
            SELECT DISTINCT
                    --ROW_NUMBER() OVER(ORDER BY  t1.stdc_std_code ASC) AS id
                     t1.stdc_std_code                 AS    stdcStdCode               
                    ,t1.stdc_org_code				  AS 	stdcOrgCode				
                    ,t1.stdc_bu_code				  AS 	stdcBuCode				
                    --,t2.bu_name					  AS 	stdcBuName						
                    ,t1.stdc_std_version			  AS 	stdcStdVersion			
                    ,t1.stdc_cours_code				  AS 	stdcCoursCode				
                    ,t4.cours_description			  AS 	stdcCoursDescription			
                    ,t1.stdc_rlay_code				  AS 	stdcRlayCode				
                    ,t6.rlay_description			  AS 	stdcRlayDescription			
                    ,t1.stdc_purc_code				  AS 	stdcPurcCode				
                    --,t7.purc_name					  AS 	stdcPurcName					
                    ,t1.stdc_item_code				  AS 	stdcItemCode				
                    --,t8.item_description			  AS 	stdcItemDescription			
                    --,t9.itmc_name					  AS 	stdcItmcName					
                    --,t10.itmc_name              	  AS 	stdcItmcParent	
                    ,t1.stdc_scho_code				  AS 	stdcSchoCode				
                    ,t5.scho_description			  AS 	stdcSchoDescription			
                    --,t1.stdc_performance			  AS 	stdcPerformance			
                    --,t1.stdc_renewal_cicle			  AS 	stdcRenewalCicle			
                    --,t1.stdc_maintenance_cicle		  AS 	stdcMaintenanceCicle		
                    --,t1.stdc_detail					  AS 	stdcDetail					
                    ,t1.stdc_status					  AS 	stdcStatus	
            FROM
                    dbo.tbl_standards_courses t1
                    JOIN dbo.tbl_business_units t2 ON
                            t2.bu_code     = t1.stdc_bu_code
                        AND t2.bu_status = 'S'
                    LEFT JOIN dbo.tbl_organizations t3 ON
                            t3.org_code = t1.stdc_org_code
                    LEFT JOIN dbo.tbl_courses t4 ON
                            t4.cours_code = t1.stdc_cours_code
                        AND t4.cours_org_code = t1.stdc_org_code
                    LEFT JOIN dbo.tbl_schools t5 ON
                            t5.scho_org_code = t1.stdc_org_code
                        AND t5.scho_code = t1.stdc_scho_code
                    LEFT JOIN dbo.tbl_rooms_layout t6 ON
                            t6.rlay_code = t1.stdc_rlay_code
                    LEFT JOIN dbo.tbl_purchase_areas t7 ON
                            t7.purc_code = t1.stdc_purc_code
                    LEFT JOIN dbo.tbl_items t8 ON
                            t8.item_code = t1.stdc_item_code
                        AND t8.item_purc_code = t1.stdc_purc_code
                    --LEFT JOIN dbo.tbl_item_categories t9 ON
                    --		t9.itmc_code = t8.item_itmc_code 
                    --LEFT JOIN dbo.tbl_item_categories t10 ON
                    --		t10.itmc_code = t9.itmc_parent_code
            ), tbl_items as (
            SELECT DISTINCT
                    --ROW_NUMBER() OVER(ORDER BY  t1.stdc_std_code ASC) AS id
                     t1.stdc_std_code                 AS    itmStdCode               
                    ,t1.stdc_org_code				  AS 	itmOrgCode				
                    ,t1.stdc_bu_code				  AS 	itmBuCode				
                    --,t2.bu_name					  AS 	itmBuName						
                    ,t1.stdc_std_version			  AS 	itmStdVersion			
                    ,t1.stdc_cours_code				  AS 	itmCoursCode				
                    --,t4.cours_description			  AS 	itmCoursDescription			
                    ,t1.stdc_rlay_code				  AS 	itmRlayCode				
                    --,t6.rlay_description			  AS 	itmRlayDescription			
                    ,t1.stdc_purc_code				  AS 	itmPurcCode				
                    --,t7.purc_name					  AS 	itmPurcName					
                    ,t1.stdc_item_code				  AS 	itmItemCode				
                    ,t8.item_description			  AS 	itmItemDescription			
                    ,t9.itmc_name					  AS 	itmItmcName					
                    ,t10.itmc_name              	  AS 	itmItmcParent	
                    ,t1.stdc_scho_code				  AS 	itmSchoCode				
                    --,t5.scho_description			  AS 	itmSchoDescription			
                    ,t1.stdc_performance			  AS 	itmPerformance			
                    ,t1.stdc_renewal_cicle			  AS 	itmRenewalCicle			
                    ,t1.stdc_maintenance_cicle		  AS 	itmMaintenanceCicle		
                    ,t1.stdc_detail					  AS 	itmDetail					
                    ,t1.stdc_status					  AS 	itmStatus	
                    ,t8.item_isbn                     AS    itmIsbn 
                    ,t8.item_attribute_01             AS    itmAttribute01 
                    ,t8.item_value_01                 AS    itmValue01     
                    ,t8.item_attribute_02             AS    itmAttribute02 
                    ,t8.item_value_02                 AS    itmValue02     
                    ,t8.item_attribute_03             AS    itmAttribute03 
                    ,t8.item_value_03                 AS    itmValue03     
                    ,t8.item_attribute_04             AS    itmAttribute04 
                    ,t8.item_value_04                 AS    itmValue04     
                    ,t8.item_attribute_05             AS    itmAttribute05 
                    ,t8.item_value_05                 AS    itmValue05     
                    ,t8.item_attribute_06             AS    itmAttribute06 
                    ,t8.item_value_06                 AS    itmValue06     
                    ,t8.item_attribute_07             AS    itmAttribute07 
                    ,t8.item_value_07                 AS    itmValue07             
            FROM
                    dbo.tbl_standards_courses t1
                    JOIN dbo.tbl_business_units t2 ON
                            t2.bu_code     = t1.stdc_bu_code
                        AND t2.bu_status = 'S'
                    LEFT JOIN dbo.tbl_organizations t3 ON
                            t3.org_code = t1.stdc_org_code
                    LEFT JOIN dbo.tbl_courses t4 ON
                            t4.cours_code = t1.stdc_cours_code
                        AND t4.cours_org_code = t1.stdc_org_code
                    LEFT JOIN dbo.tbl_schools t5 ON
                            t5.scho_org_code = t1.stdc_org_code
                        AND t5.scho_code = t1.stdc_scho_code
                    LEFT JOIN dbo.tbl_rooms_layout t6 ON
                            t6.rlay_code = t1.stdc_rlay_code
                    LEFT JOIN dbo.tbl_purchase_areas t7 ON
                            t7.purc_code = t1.stdc_purc_code
                    LEFT JOIN dbo.tbl_items t8 ON
                            t8.item_code = t1.stdc_item_code
                        AND t8.item_purc_code = t1.stdc_purc_code
                    LEFT JOIN dbo.tbl_item_categories t9 ON
                            t9.itmc_code = t8.item_itmc_code 
                    LEFT JOIN dbo.tbl_item_categories t10 ON
                            t10.itmc_code = t9.itmc_parent_code
            
            )            
                        
                        SELECT DISTINCT 
                                ROW_NUMBER() OVER(ORDER BY  t1.std_code ASC) AS standardId
                                ,t1.std_code                  AS  stdCode                
                                ,t1.std_org_code              AS  stdOrgCode            
                                ,t2.org_description			  AS  stdOrgDescription			
                                ,t1.std_bu_code				  AS  stdBuCode				
                                ,t1.std_purc_code			  AS  stdPurcCode
                                ,t7.purc_name                 AS  stdPurcDescription			
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
                                , relay = (SELECT  ROW_NUMBER() OVER(ORDER BY stdcCoursCode, stdcRlayCode ASC) AS courseId
                                                  ,*
                                    FROM (
                                            SELECT DISTINCT 
                                                    --ROW_NUMBER() OVER(ORDER BY  t01.stdcCoursCode, t01.stdcRlayCode ASC) AS courseId
                                                    --t01.id
                                                    --,t01.stdcStdCode
                                                     t01.stdcCoursCode		    
                                                    ,t01.stdcOrgCode
                                                    ,t01.stdcBuCode
                                                    ,t01.stdcPurcCode
                                                    ,t01.stdcStdVersion
                                                    ,t01.stdcCoursDescription		 	
                                                    ,t01.stdcRlayCode			
                                                    ,t01.stdcRlayDescription			
                                                    ,t01.stdcSchoCode			
                                                    ,t01.stdcSchoDescription	
                                                    ,t1.std_year as stdcYear		
                                                    --,t01.stdcStatus
                                                    ,items = (
                                                        SELECT *
                                                            FROM (
                                                                SELECT DISTINCT 
                                                                   ROW_NUMBER() OVER(ORDER BY  t001.itmItemCode ASC) AS itemId,
                                                                   (
                                                                    SELECT DISTINCT
                                                                           stdcStdCode,
                                                                           stdcOrgCode,
                                                                           stdcBuCode,
                                                                           stdcPurcCode,
                                                                           stdcCoursCode,
                                                                           stdcRlayCode,
                                                                           itmItemCode  AS  stdcItemCode,
                                                                           stdcStdVersion,
                                                                           stdcSchoCode
                                                                       FOR JSON path , INCLUDE_NULL_VALUES
                                                                   )   AS  keyToDelete
                                                                   ,itmItemCode
                                                                   ,itmItemDescription
                                                                   ,itmItmcName
                                                                   ,itmItmcParent
                                                                   --,stdcSchoCode
                                                                   ,itmPerformance
                                                                   ,itmRenewalCicle
                                                                   ,itmMaintenanceCicle
                                                                   ,itmIsbn
                                                                   ,itmAttribute01
                                                                   ,itmValue01
                                                                   ,itmAttribute02
                                                                   ,itmValue02
                                                                   ,itmAttribute03
                                                                   ,itmValue03
                                                                   ,itmAttribute04
                                                                   ,itmValue04
                                                                   ,itmAttribute05
                                                                   ,itmValue05
                                                                   ,itmAttribute06
                                                                   ,itmValue06
                                                                   ,itmAttribute07
                                                                   ,itmValue07
                                                                   ,itmStatus
                                                            FROM	tbl_items t001
                                                            WHERE 
                                                                    t01.stdcStdCode      = t001.itmStdCode
                                                                AND t01.stdcOrgCode  = t001.itmOrgCode
                                                                AND t01.stdcBuCode   = t001.itmBuCode
                                                                AND t01.stdcPurcCode = t001.itmPurcCode
                                                                AND t01.stdcStdVersion   =  t001.itmStdVersion
                                                                AND t01.stdcCoursCode   = t001.itmCoursCode
                                                                AND t01.stdcRlayCode   = t001.itmRlayCode
                                                                --AND t01.stdcItemCode   = t001.itmItemCode
               
                                                           ) t001 
                                                                 FOR JSON path , INCLUDE_NULL_VALUES
                                                       ) --AS  items
                                                FROM	tbl_rlay_courses t01
                                                WHERE 
                                                        t1.std_code      = t01.stdcStdCode
                                                    AND t1.std_org_code  = t01.stdcOrgCode
                                                    AND t1.std_bu_code   = t01.stdcBuCode
                                                    AND t1.std_purc_code = t01.stdcPurcCode
                                                    AND t1.std_version   = t01.stdcStdVersion
                                                    --AND T01.stdcCoursCode = 'TSO-002'
                                                    --AND T01.stdcRlayCode = 'CENTRO-BIB'
                                               -- ORDER BY ArtistName
                                                --FOR JSON PATH 
                                            --ORDER BY  t1.stdc_std_code		
                            ) t01 FOR JSON PATH , INCLUDE_NULL_VALUES
                            ) --AS  rlay_courses
                        FROM tbl_standards t1
                            LEFT JOIN tbl_organizations t2 ON t2.org_code = t1.std_org_code
                            LEFT JOIN tbl_charge_account t3 ON t3.cacc_code = t1.std_cacc_code AND t3.cacc_org_code = t2.org_code
                            LEFT JOIN tbl_schools t4 ON t4.scho_code = t1.std_scho_code and t4.scho_org_code = t1.std_org_code
                            LEFT JOIN tbl_users_business_units t5 ON  t5.usbu_bu_code = t1.std_bu_code 
                            LEFT JOIN tbl_users_charge_accounts t6 ON  t6.ucac_cacc_code = t1.std_cacc_code AND t6.ucac_purc_code = t1.std_purc_code
                            LEFT JOIN tbl_purchase_areas t7 ON t7.purc_code = t1.std_purc_code
                        WHERE
                                    t1.std_code      = @stdcStdCode
                                AND t1.std_org_code  = @stdcOrgCode
                                AND t1.std_bu_code   = @stdcBuCode
                                AND t1.std_purc_code = @stdcPurcCode
                                AND t1.std_year      = @stdcYear 
                                AND t1.std_version   = @stdcVersion
                                AND t5.usbu_user_id  = @stdcUserId
                                AND t6.ucac_user_id  = @stdcUserId 
                                AND t5.usbu_bu_code  = @stdcBuCode
                                AND t4.scho_description IS NOT NULL
                        ORDER BY  t1.std_code
                        FOR JSON PATH , INCLUDE_NULL_VALUES,  ROOT('standard')
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdcStdCode',    sql.VarChar, stdcStdCode   )
                            .input('stdcOrgCode',    sql.VarChar, stdcOrgCode   )
                            .input('stdcBuCode',     sql.VarChar, stdcBuCode   )
                            .input('stdcPurcCode',   sql.VarChar, stdcPurcCode  )
                            //.input('stdcCoursCode',  sql.VarChar, stdcCoursCode )
                            //.input('stdcRlayCode',   sql.VarChar, stdcRlayCode  )
                            //.input('stdcItemCode',   sql.Int,     stdcItemCode  )
                            .input('stdcVersion',    sql.Int,     stdcVersion   )
                            .input('stdcYear',       sql.Int,     stdcYear  )
                            .input('stdcUserId',     sql.VarChar, stdcUserId  )
                            .query(sqlGetAllStandardCoursesByUserId);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Estandares Asignasturas encontrados' : 'No se encontraron Estandares Asignasturas',
            standardCourses: result?.recordset
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

module.exports.getStandardCourseByStandardUserId = getStandardCourseByStandardUserId;

const getStandardCourseBySearch = async( 
    stdcStdCode,
    stdcOrgCode,
    stdcBuCode,
    stdcPurcCode,
    stdcCoursCode,
    stdcRlayCode,
    stdcItemCode,
    stdcStdVersion,
    stdcSchoCode) => {

    let respuesta;    
    try {
        
        const sqlGetAllStandardCoursesByUserId = `
            SELECT
                 ROW_NUMBER() OVER(ORDER BY  t1.stdc_std_code ASC) AS id
                 ,t1.stdc_std_code                 AS    stdcStdCode               
                 ,t1.stdc_org_code				  AS 	stdcOrgCode				
                 ,t3.org_description				  AS 	stdcOrgDescription				
                 ,t1.stdc_bu_code				  AS 	stdcBuCode				
                 ,t2.bu_name						  AS 	stdcBuName						
                 ,t1.stdc_std_version			  AS 	stdcStdVersion			
                 ,t1.stdc_cours_code				  AS 	stdcCoursCode				
                 ,t4.cours_description			  AS 	stdcCoursDescription			
                 ,t1.stdc_rlay_code				  AS 	stdcRlayCode				
                 ,t6.rlay_description			  AS 	stdcRlayDescription			
                 ,t1.stdc_purc_code				  AS 	stdcPurcCode				
                 ,t7.purc_name					  AS 	stdcPurcName					
                 ,t1.stdc_item_code				  AS 	stdcItemCode				
                 ,t8.item_description			  AS 	stdcItemDescription			
                 ,t9.itmc_name					  AS 	stdcItmcName					
                 ,t10.itmc_name              	  AS 	stdcItmcParent	
                 ,t1.stdc_scho_code				  AS 	stdcSchoCode				
                 ,t5.scho_description			  AS 	stdcSchoDescription			
                 ,t1.stdc_performance			  AS 	stdcPerformance			
                 ,t1.stdc_renewal_cicle			  AS 	stdcRenewalCicle			
                 ,t1.stdc_maintenance_cicle		  AS 	stdcMaintenanceCicle		
                 ,t1.stdc_detail					  AS 	stdcDetail					
                 ,t1.stdc_status					  AS 	stdcStatus	
                FROM
                    dbo.tbl_standards_courses t1
                    JOIN dbo.tbl_business_units t2 ON
                            t2.bu_code     = t1.stdc_bu_code
                        AND t2.bu_status = 'S'
                    LEFT JOIN dbo.tbl_organizations t3 ON
                            t3.org_code = t1.stdc_org_code
                    LEFT JOIN dbo.tbl_courses t4 ON
                            t4.cours_code = t1.stdc_cours_code
                        AND t4.cours_org_code = t1.stdc_org_code
                    LEFT JOIN dbo.tbl_schools t5 ON
                            t5.scho_org_code = t1.stdc_org_code
                        AND t5.scho_code = t1.stdc_scho_code
                    LEFT JOIN dbo.tbl_rooms_layout t6 ON
                            t6.rlay_code = t1.stdc_rlay_code
                    LEFT JOIN dbo.tbl_purchase_areas t7 ON
                            t7.purc_code = t1.stdc_purc_code
                    LEFT JOIN dbo.tbl_items t8 ON
                            t8.item_code = t1.stdc_item_code
                        AND t8.item_purc_code = t1.stdc_purc_code
                    LEFT JOIN dbo.tbl_item_categories t9 ON
                            t9.itmc_code = t8.item_itmc_code 
                    LEFT JOIN dbo.tbl_item_categories t10 ON
                            t10.itmc_code = t9.itmc_parent_code
                WHERE
                        t1.stdc_std_code    = COALESCE(@stdcStdCode,t1.stdc_std_code)
                    and t1.stdc_org_code    = COALESCE(@stdcOrgCode,t1.stdc_org_code)
                    and t1.stdc_bu_code     = COALESCE(@stdcBuCode,t1.stdc_bu_code)
                    and t1.stdc_std_version = COALESCE(@stdcStdVersion,t1.stdc_std_version)
                    and t1.stdc_cours_code  = COALESCE(@stdcCoursCode,t1.stdc_cours_code)
                    and t1.stdc_rlay_code   = COALESCE(@stdcRlayCode,t1.stdc_rlay_code)
                    and t1.stdc_purc_code   = COALESCE(@stdcPurcCode,t1.stdc_purc_code)
                    and t1.stdc_item_code   = COALESCE(@stdcItemCode,t1.stdc_item_code)
                    and t1.stdc_scho_code   = COALESCE(@stdcSchoCode,t1.stdc_scho_code)
                ORDER BY  t1.stdc_std_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdcStdCode',    sql.VarChar, stdcStdCode    )
                            .input('stdcOrgCode',    sql.VarChar, stdcOrgCode    )
                            .input('stdcBuCode',     sql.VarChar, stdcBuCode     )
                            .input('stdcPurcCode',   sql.VarChar, stdcPurcCode   )
                            .input('stdcCoursCode',  sql.VarChar, stdcCoursCode  )
                            .input('stdcRlayCode',   sql.VarChar, stdcRlayCode   )
                            .input('stdcItemCode',   sql.Int,     stdcItemCode   )
                            .input('stdcStdVersion', sql.Int,     stdcStdVersion )
                            .input('stdcSchoCode',   sql.VarChar, stdcSchoCode   )
                            .query(sqlGetAllStandardCoursesByUserId);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Estandares encontrados' : 'No se encontraron Estandares',
            standardCourses: result?.recordset
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

module.exports.getStandardCourseBySearch = getStandardCourseBySearch;

const createStandardCourse = async ( { 
    stdcStdCode,
    stdcOrgCode,
    stdcBuCode,
    stdcStdVersion,
    stdcCoursCode,
    stdcRlayCode,
    stdcPurcCode,
    stdcItemCode,
    stdcSchoCode,
    stdcPerformance,
    stdcRenewalCicle,
    stdcMaintenanceCicle,
    stdcDetail,
    stdcStatus} ) => {
        
    let respuesta;
    try {
        
        const sqlCreateStandardCourse = `
                INSERT INTO tbl_standards_courses
                        (stdc_std_code
                        ,stdc_org_code
                        ,stdc_bu_code
                        ,stdc_std_version
                        ,stdc_cours_code
                        ,stdc_rlay_code
                        ,stdc_purc_code
                        ,stdc_item_code
                        ,stdc_scho_code
                        ,stdc_performance
                        ,stdc_renewal_cicle
                        ,stdc_maintenance_cicle
                        ,stdc_detail
                        ,stdc_status)
                VALUES
                        (@stdcStdCode
                        ,@stdcOrgCode
                        ,@stdcBuCode
                        ,@stdcStdVersion
                        ,@stdcCoursCode
                        ,@stdcRlayCode
                        ,@stdcPurcCode
                        ,@stdcItemCode
                        ,@stdcSchoCode
                        ,@stdcPerformance
                        ,@stdcRenewalCicle
                        ,@stdcMaintenanceCicle
                        ,@stdcDetail
                        ,@stdcStatus)     
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdcStdCode',            sql.VarChar,stdcStdCode         )
                            .input('stdcOrgCode',            sql.VarChar,stdcOrgCode         )
                            .input('stdcBuCode',             sql.VarChar,stdcBuCode          )
                            .input('stdcStdVersion',         sql.VarChar,stdcStdVersion      )
                            .input('stdcCoursCode',          sql.VarChar,stdcCoursCode       )
                            .input('stdcRlayCode',           sql.VarChar,stdcRlayCode        )
                            .input('stdcPurcCode',           sql.VarChar,stdcPurcCode        )
                            .input('stdcItemCode',           sql.VarChar,stdcItemCode        )
                            .input('stdcSchoCode',           sql.VarChar,stdcSchoCode        )
                            .input('stdcPerformance',        sql.VarChar,stdcPerformance     )
                            .input('stdcRenewalCicle',       sql.VarChar,stdcRenewalCicle    )
                            .input('stdcMaintenanceCicle',   sql.VarChar,stdcMaintenanceCicle)
                            .input('stdcDetail',             sql.VarChar,stdcDetail          )
                            .input('stdcStatus',             sql.VarChar,stdcStatus          )                               
                            .query(sqlCreateStandardCourse);
        
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
module.exports.createStandardCourse = createStandardCourse;

const updateStandardCourse = async( 
    params,     
    stdcStdCode, 
    stdcOrgCode,
    stdcBuCode, 
    stdcStdVersion, 
    stdcCoursCode, 
    stdcRlayCode, 
    stdcPurcCode, 
    stdcItemCode, 
    stdcSchoCode
     ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateStandardCourse = `
        UPDATE dbo.tbl_standards_courses 
           SET ${columnSet}
        WHERE
                stdc_std_code    = @stdcStdCode
            and stdc_org_code    = @stdcOrgCode
            and stdc_purc_code   = @stdcPurcCode
            and stdc_bu_code     = @stdcBuCode
            and stdc_cours_code  = @stdcCoursCode
            and stdc_rlay_code   = @stdcRlayCode
            and stdc_item_code   = @stdcItemCode
            and stdc_std_version = @stdcStdVersion
            and stdc_scho_code   = @stdcSchoCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdcStdCode',     sql.VarChar, stdcStdCode     )
                            .input('stdcOrgCode',     sql.VarChar, stdcOrgCode     )
                            .input('stdcBuCode',      sql.VarChar, stdcBuCode      )
                            .input('stdcStdVersion',  sql.Int,     stdcStdVersion  )
                            .input('stdcCoursCode',   sql.VarChar, stdcCoursCode   )
                            .input('stdcRlayCode',    sql.VarChar, stdcRlayCode    )
                            .input('stdcPurcCode',    sql.VarChar, stdcPurcCode    )
                            .input('stdcItemCode',    sql.Int,     stdcItemCode    )
                            .input('stdcSchoCode',    sql.VarChar, stdcSchoCode    )
                            .query(sqlUpdateStandardCourse);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateStandardCourse = updateStandardCourse;

const deleteStandardCourse = async ( 
    stdcStdCode, 
    stdcOrgCode,
    stdcBuCode, 
    stdcStdVersion, 
    stdcCoursCode, 
    stdcRlayCode, 
    stdcPurcCode, 
    stdcItemCode, 
    stdcSchoCode
 ) => {
        
    try {
        
        const sqlDeleteStandardCourse = `
            DELETE FROM dbo.tbl_standards_courses
            WHERE
                    stdc_std_code    = @stdcStdCode
                and stdc_org_code    = @stdcOrgCode
                and stdc_purc_code   = @stdcPurcCode
                and stdc_bu_code     = @stdcBuCode
                and stdc_cours_code  = @stdcCoursCode
                and stdc_rlay_code   = @stdcRlayCode
                and stdc_item_code   = @stdcItemCode
                and stdc_std_version = @stdcStdVersion
                and stdc_scho_code   = @stdcSchoCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdcStdCode',    sql.VarChar, stdcStdCode   )
                            .input('stdcOrgCode',    sql.VarChar, stdcOrgCode   )
                            .input('stdcPurcCode',   sql.VarChar, stdcPurcCode  )
                            .input('stdcBuCode',     sql.VarChar, stdcBuCode    )
                            .input('stdcCoursCode',  sql.VarChar, stdcCoursCode )
                            .input('stdcRlayCode',   sql.VarChar, stdcRlayCode  )
                            .input('stdcItemCode',   sql.Int,     stdcItemCode  )
                            .input('stdcStdVersion', sql.Int,     stdcStdVersion)
                            .input('stdcSchoCode',   sql.VarChar, stdcSchoCode  )
                            .query(sqlDeleteStandardCourse);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteStandardCourse = deleteStandardCourse;

const deleteStandardCourseByRlayCourseCode = async ( 
    stdcStdCode,
    stdcOrgCode,
    stdcPurcCode,
    stdcBuCode,
    stdcCoursCode,
    stdcRlayCode,
    stdcStdVersion,
 ) => {
        
    try {
        
        const sqlDeleteStandardCourseByRlayCode = `
            DELETE FROM dbo.tbl_standards_courses
             WHERE stdc_std_code    = @stdcStdCode
               and stdc_org_code    = @stdcOrgCode
               and stdc_purc_code   = @stdcPurcCode
               and stdc_bu_code     = @stdcBuCode
               and stdc_cours_code  = @stdcCoursCode
               and stdc_rlay_code   = @stdcRlayCode
               and stdc_std_version = @stdcStdVersion
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('stdcStdCode',    sql.VarChar, stdcStdCode )
                            .input('stdcOrgCode',    sql.VarChar, stdcOrgCode )
                            .input('stdcPurcCode',   sql.VarChar, stdcPurcCode )
                            .input('stdcBuCode',     sql.VarChar, stdcBuCode )
                            .input('stdcCoursCode',  sql.VarChar, stdcCoursCode )
                            .input('stdcRlayCode',   sql.VarChar, stdcRlayCode )
                            .input('stdcStdVersion', sql.VarChar, stdcStdVersion )
                            .query(sqlDeleteStandardCourseByRlayCode);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteStandardCourseByRlayCourseCode = deleteStandardCourseByRlayCourseCode;
