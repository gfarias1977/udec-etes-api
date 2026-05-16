const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const majorExist = async ( majorCode ) => {

    let respuesta;
    try {
        const sqlMajorExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Carrera ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_majors t1
                    WHERE t1.major_code     =  @majorCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('majorCode',  sql.VarChar, majorCode )
                            .query(sqlMajorExists);

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
module.exports.majorExist = majorExist;

const getAllMajors = async() => {

    let respuesta;
    try {
        const sqlGetAllMajors = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.major_code ASC) AS id
            ,t1.major_code              AS majorCode                     
            ,t1.major_org_code          AS majorOrgCode  
            ,t3.org_description         AS majorOrgDescription
            ,t1.major_school_code       AS majorSchoolCode          
            ,t4.scho_description        AS majorSchoolDescription
            ,t1.major_cacc_code         AS majorCaccCode 
            ,t5.cacc_description        AS majorCaccDescription
            ,t1.major_level_code        AS majorLevelCode   
            ,t6.level_description       AS majorLevelDescription
            ,t1.major_short_description AS majorShortDescription   
            ,t1.major_description       AS majorDescription        
            ,t1.major_creation_date     AS majorCreationDate     
            ,t1.major_status            AS majorStatus            
            ,t2.std_purc_code		    AS purcCode
        FROM dbo.tbl_majors              t1
        join dbo.tbl_standards           t2 on t1.major_code = t2.std_code
        left join dbo.tbl_organizations  t3 on t3.org_code   = t1.major_org_code
        left join dbo.tbl_schools        t4 on t4.scho_code  = t1.major_school_code and t4.scho_org_code = t1.major_org_code 
        left join dbo.tbl_charge_account t5 on t5.cacc_code  = t1.major_cacc_code and t5.cacc_org_code = t1.major_org_code 
        left join dbo.tbl_levels         t6 on t6.level_code = t1.major_level_code
        order by t1.major_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllMajors);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.recordset.length > 0 ? 'Carreras encontradas' : 'No se encontraron Carreras',
            majors: result?.recordset
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
module.exports.getAllMajors = getAllMajors;

const getMajors = async() => {

    let respuesta;
    try {
        const sqlGetAllMajors = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.major_code ASC) AS id
            ,t1.major_code              AS majorCode                     
            ,t1.major_org_code          AS majorOrgCode  
            ,t3.org_description         AS majorOrgDescription
            ,t1.major_school_code       AS majorSchoolCode          
            ,t4.scho_description        AS majorSchoolDescription
            ,t1.major_cacc_code         AS majorCaccCode 
            ,t5.cacc_description        AS majorCaccDescription
            ,t1.major_level_code        AS majorLevelCode   
            ,t6.level_description       AS majorLevelDescription
            ,t1.major_short_description AS majorShortDescription   
            ,t1.major_description       AS majorDescription        
            ,t1.major_creation_date     AS majorCreationDate     
            ,t1.major_status            AS majorStatus            
        FROM dbo.tbl_majors              t1
        left join dbo.tbl_organizations  t3 on t3.org_code   = t1.major_org_code
        left join dbo.tbl_schools        t4 on t4.scho_code  = t1.major_school_code and t4.scho_org_code = t1.major_org_code 
        left join dbo.tbl_charge_account t5 on t5.cacc_code  = t1.major_cacc_code and t5.cacc_org_code = t1.major_org_code 
        left join dbo.tbl_levels         t6 on t6.level_code = t1.major_level_code
        order by t1.major_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllMajors);

        respuesta = {
            type: 'ok',   
            status: 200,
            message: result?.recordset.length > 0 ? 'Carreras encontradas' : 'No se encontraron Carreras',
            majors: result?.recordset
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
module.exports.getMajors = getMajors;

const getMajorById = async( majorCode ) => {

    try {
        
        const sqlGetMajorByID = `
                SELECT ROW_NUMBER() OVER(ORDER BY  t1.major_code ASC) AS id
                    ,t1.major_code               AS majorCode                
                    ,t1.major_org_code           AS majorOrgCode            
                    ,t1.major_school_code        AS majorSchoolCode         
                    ,t1.major_cacc_code          AS majorCaccCode            
                    ,t1.major_level_code         AS majorLevelCode           
                    ,t1.major_short_description  AS majorShortDescription    
                    ,t1.major_description        AS majorDescription         
                    ,t1.major_creation_date      AS majorCreationDate        
                    ,t1.major_status             AS majorStatus           
                FROM dbo.tbl_majors t1
                WHERE t1.major_code = @majorCode
                order by t1.major_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('majorCode', sql.VarChar, majorCode )                            
                            .query(sqlGetMajorByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getMajorById = getMajorById;

const getAllMajorsByName = async(majorDescription) => {

    const qryFindMajors = 
    `       SELECT ROW_NUMBER() OVER(ORDER BY  t1.major_code ASC) AS id
                ,t1.major_code                 AS majorCode             
                ,t1.major_org_code             AS majorOrgCode           
                ,t1.major_school_code          AS majorSchoolCode        
                ,t1.major_cacc_code            AS majorCaccCode          
                ,t1.major_level_code           AS majorLevelCode         
                ,t1.major_short_description    AS majorShortDescription   
                ,t1.major_description          AS majorDescription       
                ,t1.major_creation_date        AS majorCreationDate     
                ,t1.major_status               AS majorStatus           
            FROM dbo.tbl_majors t1
            WHERE UPPER(t1.major_description)  LIKE UPPER(CONCAT('%',@majorDescription,'%'))
            AND t1.major_status = 'S'
            order by t1.major_code
            `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('majorDescription', sql.VarChar, majorDescription )
                            .query(qryFindMajors);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Carreras encontradas' : 'No se encontraron Carreras',
            majors: result?.recordset
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
module.exports.getAllMajorsByName = getAllMajorsByName;

const createMajor = async ( { 
    majorCode,
    majorOrgCode,
    majorSchoolCode,
    majorCaccCode,
    majorLevelCode,
    majorShortDescription,
    majorDescription,
    majorStatus   
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateMajor = `
                INSERT INTO tbl_majors
                        (major_code
                        ,major_org_code
                        ,major_school_code
                        ,major_cacc_code
                        ,major_level_code
                        ,major_short_description
                        ,major_description
                        ,major_creation_date
                        ,major_status)
                VALUES
                        (@majorCode
                        ,@majorOrgCode
                        ,@majorSchoolCode
                        ,@majorCaccCode
                        ,@majorLevelCode
                        ,@majorShortDescription
                        ,@majorDescription
                        ,DBO.fncGetDate()
                        ,@majorStatus)    
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('majorCode',             sql.VarChar,majorCode)    
                            .input('majorOrgCode',          sql.VarChar,majorOrgCode)
                            .input('majorSchoolCode',       sql.VarChar,majorSchoolCode)    
                            .input('majorCaccCode',         sql.VarChar,majorCaccCode)      
                            .input('majorLevelCode',        sql.VarChar,majorLevelCode)       
                            .input('majorShortDescription', sql.VarChar,majorShortDescription)
                            .input('majorDescription',      sql.VarChar,majorDescription) 
                            .input('majorStatus',           sql.VarChar,majorStatus)      
                            .query(sqlCreateMajor);
        
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
module.exports.createMajor = createMajor;

const updateMajor = async( params, majorCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateMajor = `
        UPDATE tbl_majors
           SET ${columnSet}
         WHERE major_code = @majorCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('majorCode', sql.VarChar, majorCode )
                            .query(sqlUpdateMajor);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateMajor = updateMajor;

const deleteMajor = async ( majorCode ) => {
        
    try {
        
        const sqlDeleteMajor = `
        DELETE 
          FROM tbl_majors
         WHERE major_code = @majorCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('majorCode',     sql.VarChar, majorCode )
                            .query(sqlDeleteMajor);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteMajor = deleteMajor;
