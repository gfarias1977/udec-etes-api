const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const courseExists = async ( coursCode ) => {

    let respuesta;
    try {
        const sqlCourseExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Carrera ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_courses t1
                    WHERE t1.cours_code      =   @coursCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('coursCode',  sql.VarChar, coursCode )
                            .query(sqlCourseExists);

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
module.exports.courseExists = courseExists;

const getAllCourses = async() => {

    let respuesta;
    try {
        const sqlGetAllCourses = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.cours_code ASC) AS id 
                ,t1.cours_code                 AS coursCode
                ,t1.cours_org_code             AS coursOrgCode
                ,t2.org_description            AS orgDescription
                ,t1.cours_scho_code            AS coursSchoCode
                ,t3.scho_description           AS schoDescription
                ,t1.cours_short_description    AS coursShortDescription
                ,t1.cours_description          AS coursDescription
                ,t1.cours_type                 AS coursType
                ,t1.cours_method               AS coursMethod
                ,t1.cours_duration             AS coursDuration
                ,t1.cours_modality             AS coursModality
                ,t1.cours_elearning            AS coursElearning
                ,t1.cours_clinical_field       AS coursClinicalField
                ,t1.cours_creation_date        AS coursCreationDate
                ,t1.cours_status               AS coursStatus
            FROM dbo.tbl_courses t1
            left join [dbo].[tbl_organizations] t2 on t1.cours_org_code  = t2.org_code
            left join [dbo].[tbl_schools]       t3 on t1.cours_scho_code = t3.scho_code and t1.cours_org_code  = t3.scho_org_code
            order by t1.cours_description 
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllCourses);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Carreras encontrados' : 'No se encontraron Carreras',
            courses: result?.recordset
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
module.exports.getAllCourses = getAllCourses;

const getAllCoursesByOrgCodeAndSchoCode = async(orgCode, schoCode) => {

    let respuesta;
    try {
        const sqlGetAllCourses = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.cours_code ASC) AS id 
                ,t1.cours_code                 AS coursCode
                ,t1.cours_org_code             AS coursOrgCode
				,t2.org_description            AS orgDescription
                ,t1.cours_scho_code            AS coursSchoCode
				,t3.scho_description           AS schoDescription
                ,t1.cours_short_description    AS coursShortDescription
                ,t1.cours_description          AS coursDescription
                ,t1.cours_type                 AS coursType
                ,t1.cours_method               AS coursMethod
                ,t1.cours_duration             AS coursDuration
                ,t1.cours_modality             AS coursModality
                ,t1.cours_elearning            AS coursElearning
                ,t1.cours_clinical_field       AS coursClinicalField
                ,t1.cours_creation_date        AS coursCreationDate
                ,'[' + t1.cours_code  + '] ' + t1.cours_description as coursOptionLabel
                ,t1.cours_status               AS coursStatus
            FROM dbo.tbl_courses t1
			left join [dbo].[tbl_organizations] t2 on t1.cours_org_code  = t2.org_code
			left join [dbo].[tbl_schools]       t3 on t1.cours_scho_code = t3.scho_code and t1.cours_org_code  = t3.scho_org_code
            WHERE t1.cours_org_code  = @orgCode
              AND t1.cours_scho_code = @schoCode
              AND t1.cours_status = 'S'                
            order by t1.cours_description 
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgCode',  sql.VarChar, orgCode )
                            .input('schoCode', sql.VarChar, schoCode )
                            .query(sqlGetAllCourses);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Carreras encontrados' : 'No se encontraron Carreras',
            courses: result?.recordset
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
module.exports.getAllCoursesByOrgCodeAndSchoCode = getAllCoursesByOrgCodeAndSchoCode;


const getCourseById = async( coursCode) => {

    try {
        
        const sqlGetCourseByID = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.cours_code ASC) AS id 
                ,t1.cours_code                 AS coursCode
                ,t1.cours_org_code             AS coursOrgCode
                ,t2.org_description            AS orgDescription
                ,t1.cours_scho_code            AS coursSchoCode
                ,t3.scho_description           AS schoDescription
                ,t1.cours_short_description    AS coursShortDescription
                ,t1.cours_description          AS coursDescription
                ,t1.cours_type                 AS coursType
                ,t1.cours_method               AS coursMethod
                ,t1.cours_duration             AS coursDuration
                ,t1.cours_modality             AS coursModality
                ,t1.cours_elearning            AS coursElearning
                ,t1.cours_clinical_field       AS coursClinicalField
                ,t1.cours_creation_date        AS coursCreationDate
                ,t1.cours_status               AS coursStatus
            FROM dbo.tbl_courses t1
            left join [dbo].[tbl_organizations] t2 on t1.cours_org_code  = t2.org_code
            left join [dbo].[tbl_schools]       t3 on t1.cours_scho_code = t3.scho_code and t1.cours_org_code  = t3.scho_org_code
            WHERE t1.cours_code = @coursCode
            and t1.cours_status = 'S'
            order by t1.cours_description 
  
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('coursCode', sql.VarChar, coursCode )                            
                            .query(sqlGetCourseByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getCourseById = getCourseById;

const getAllCourseByName = async(coursDescription) => {

    const qryFindCourses = 
    `
    SELECT ROW_NUMBER() OVER(ORDER BY  t1.cours_code ASC) AS id 
            ,t1.cours_code                 AS coursCode
            ,t1.cours_org_code             AS coursOrgCode
            ,t2.org_description            AS orgDescription
            ,t1.cours_scho_code            AS coursSchoCode
            ,t3.scho_description           AS schoDescription
            ,t1.cours_short_description    AS coursShortDescription
            ,t1.cours_description          AS coursDescription
            ,t1.cours_type                 AS coursType
            ,t1.cours_method               AS coursMethod
            ,t1.cours_duration             AS coursDuration
            ,t1.cours_modality             AS coursModality
            ,t1.cours_elearning            AS coursElearning
            ,t1.cours_clinical_field       AS coursClinicalField
            ,t1.cours_creation_date        AS coursCreationDate
            ,t1.cours_status               AS coursStatus
        FROM dbo.tbl_courses t1
        left join [dbo].[tbl_organizations] t2 on t1.cours_org_code  = t2.org_code
        left join [dbo].[tbl_schools]       t3 on t1.cours_scho_code = t3.scho_code and t1.cours_org_code  = t3.scho_org_code
        WHERE UPPER(t1.cours_description)  LIKE UPPER(CONCAT('%',@coursDescription,'%'))
           AND t1.cours_status = 'S'
        order by t1.cours_description 
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('coursDescription', sql.VarChar, coursDescription )
                            .query(qryFindCourses);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Carreras encontradas' : 'No se encontraron Carreras',
            courses: result?.recordset
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
module.exports.getAllCourseByName = getAllCourseByName;

const createCourse = async ( { 
    coursCode,       
    coursOrgCode,
    coursSchoCode,
    coursShortDescription,
    coursDescription,
    coursType,
    coursMethod,
    coursDuration,
    coursModality,
    coursElearning,
    coursClinicalField,
    coursStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateCourse = `
            INSERT INTO dbo.tbl_courses
                    (cours_code
                    ,cours_org_code
                    ,cours_scho_code
                    ,cours_short_description
                    ,cours_description
                    ,cours_type
                    ,cours_method
                    ,cours_duration
                    ,cours_modality
                    ,cours_elearning
                    ,cours_clinical_field
                    ,cours_creation_date
                    ,cours_status)
            VALUES
                    (@coursCode
                    ,@coursOrgCode
                    ,@coursSchoCode
                    ,@coursShortDescription
                    ,@coursDescription
                    ,@coursType
                    ,@coursMethod
                    ,@coursDuration
                    ,@coursModality
                    ,@coursElearning
                    ,@coursClinicalField
                    ,DBO.fncGetDate()
                    ,@coursStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('coursCode',             sql.VarChar,  coursCode )             
                            .input('coursOrgCode',          sql.VarChar,  coursOrgCode )
                            .input('coursSchoCode',         sql.VarChar,  coursSchoCode )
                            .input('coursShortDescription', sql.VarChar,  coursShortDescription )
                            .input('coursDescription',      sql.VarChar,  coursDescription )
                            .input('coursType',             sql.VarChar,  coursType )
                            .input('coursMethod',           sql.VarChar,  coursMethod )
                            .input('coursDuration',         sql.VarChar,  coursDuration )
                            .input('coursModality',         sql.VarChar,  coursModality )
                            .input('coursElearning',        sql.VarChar,  coursElearning )
                            .input('coursClinicalField',    sql.VarChar,  coursClinicalField )
                            .input('coursStatus',           sql.VarChar,  coursStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateCourse);
        
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
module.exports.createCourse = createCourse;

const updateCourse = async( params, coursCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateCourse= `
        UPDATE tbl_courses
           SET ${columnSet}
         WHERE cours_code = @coursCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('coursCode',     sql.VarChar, coursCode )
                            .query(sqlUpdateCourse);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateCourse = updateCourse;

const deleteCourse = async ( coursCode ) => {
        
    try {
        
        const sqlDeleteCourse = `
        DELETE 
          FROM tbl_courses
         WHERE cours_code = @coursCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('coursCode',     sql.VarChar, coursCode )
                            .query(sqlDeleteCourse);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteCourse = deleteCourse;
