const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const programExist = async ( progCode, progMajorCode ) => {

    let respuesta;
    try {
        const sqlProgramExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Plan ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_programs t1
                    WHERE t1.prog_code       = @progCode
                      AND t1.prog_major_code = @progMajorCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('progCode',       sql.VarChar, progCode )
                            .input('progMajorCode',  sql.VarChar, progMajorCode )
                            .query(sqlProgramExists);

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
module.exports.programExist = programExist;

const getAllPrograms = async() => {

    let respuesta;
    try {
        const sqlGetAllPrograms = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.prog_code, t1.prog_major_code ASC) AS id
                ,t1.prog_code           AS progCode          
                ,t1.prog_major_code     AS progMajorCode       
                ,t1.prog_prot_code      AS progProtCode      
                ,t1.prog_prop_code      AS progPropCode       
                ,t1.prog_year           AS progYear             
                ,t1.prog_major_name     AS progMajorName       
                ,t1.prog_title          AS progTitle           
                ,t1.prog_degre          AS progDegre            
                ,t1.prog_bachelor       AS progBachelor        
                ,t1.prog_level          AS progLevel                              
                ,t1.prog_creation_date  AS progCreationDate     
                ,t1.prog_status         AS progStatus           
            FROM dbo.tbl_programs t1
            ORDER BY t1.prog_code, t1.prog_major_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllPrograms);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Planes encontrados' : 'No se encontraron Planes',
            programs: result?.recordset
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
module.exports.getAllPrograms = getAllPrograms;


const getProgramById = async( progCode, progMajorCode ) => {

    try {
        
        const sqlGetProgramByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.prog_code ASC) AS id
                ,t1.prog_code             AS progCode         
                ,t1.prog_major_code       AS progMajorCode     
                ,t1.prog_prot_code        AS progProtCode     
                ,t1.prog_prop_code        AS progPropCode     
                ,t1.prog_year             AS progYear          
                ,t1.prog_major_name       AS progMajorName     
                ,t1.prog_title            AS progTitle         
                ,t1.prog_degre            AS progDegre        
                ,t1.prog_bachelor         AS progBachelor     
                ,t1.prog_level            AS progLevel               
                ,t1.prog_creation_date    AS progCreationDate  
                ,t1.prog_status           AS progStatus        
            FROM dbo.tbl_programs t1
            WHERE t1.prog_code = @progCode
              AND t1.prog_major_code = @progMajorCode
            ORDER BY t1.prog_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('progCode', sql.VarChar, progCode )                            
                            .input('progMajorCode', sql.VarChar, progMajorCode )                            
                            .query(sqlGetProgramByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getProgramById = getProgramById;

const getAllProgramsByName = async(progName) => {

    const qryFindPrograms = 
    `

        SELECT ROW_NUMBER() OVER(ORDER BY  t1.prog_code ASC) AS id
            ,t1.prog_code           AS progCode         
            ,t1.prog_major_code     AS progMajorCode    
            ,t1.prog_prot_code      AS progProtCode     
            ,t1.prog_prop_code      AS progPropCode      
            ,t1.prog_year           AS progYear         
            ,t1.prog_major_name     AS progMajorName     
            ,t1.prog_title          AS progTitle         
            ,t1.prog_degre          AS progDegre         
            ,t1.prog_bachelor       AS progBachelor      
            ,t1.prog_level          AS progLevel            
            ,t1.prog_creation_date  AS progCreationDate   
            ,t1.prog_status         AS progStatus       
        FROM dbo.tbl_programs t1
        WHERE UPPER(t1.prog_major_name)  LIKE UPPER(CONCAT('%',@progName,'%'))
        AND t1.prog_status = 'S'
        ORDER BY t1.prog_code    
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('progName', sql.VarChar, progName )
                            .query(qryFindPrograms);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Planes encontradas' : 'No se encontraron Planes',
            programs: result?.recordset
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
module.exports.getAllProgramsByName = getAllProgramsByName;

const createProgram = async ( { 
         progCode
        ,progMajorCode
        ,progProtCode
        ,progPropCode
        ,progYear
        ,progMajorName
        ,progTitle
        ,progDegre
        ,progBachelor
        ,progLevel            
        ,progRegistrationDate
        ,progStatus
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateProgram = `
                INSERT INTO dbo.tbl_programs
                        (prog_code
                        ,prog_major_code
                        ,prog_prot_code
                        ,prog_prop_code
                        ,prog_year
                        ,prog_major_name
                        ,prog_title
                        ,prog_degre
                        ,prog_bachelor
                        ,prog_level            
                        ,prog_creation_date
                        ,prog_status)
                VALUES
                        (
                         @progCode
                        ,@progMajorCode
                        ,@progProtCode
                        ,@progPropCode
                        ,@progYear
                        ,@progMajorName
                        ,@progTitle
                        ,@progDegre
                        ,@progBachelor
                        ,@progLevel            
                        ,DBO.fncGetDate()
                        ,@progStatus)    
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('progCode',        sql.VarChar,progCode     )        
                            .input('progMajorCode',   sql.VarChar,progMajorCode)  
                            .input('progProtCode',    sql.VarChar,progProtCode )   
                            .input('progPropCode',    sql.VarChar,progPropCode )    
                            .input('progYear',        sql.VarChar,progYear     )
                            .input('progMajorName',   sql.VarChar,progMajorName)    
                            .input('progTitle',       sql.VarChar,progTitle    )    
                            .input('progDegre',       sql.VarChar,progDegre    )    
                            .input('progBachelor',    sql.VarChar,progBachelor )    
                            .input('progLevel',       sql.VarChar,progLevel    )    
                            .input('progStatus',      sql.VarChar,progStatus   )    
                            .query(sqlCreateProgram);
        
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
module.exports.createProgram = createProgram;

const updateProgram = async( params, progCode, progMajorCode) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateProgram = `
        UPDATE tbl_programs
           SET ${columnSet}
         WHERE prog_code       = @progCode
           AND prog_major_code = @progMajorCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('progCode',      sql.VarChar, progCode )
                            .input('progMajorCode', sql.VarChar, progMajorCode )   
                            .query(sqlUpdateProgram);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateProgram = updateProgram;

const deleteProgram = async ( progCode , progMajorCode) => {
        
    try {
        
        const sqlDeleteProgram = `
        DELETE 
          FROM tbl_programs
         WHERE prog_code       = @progCode
           AND prog_major_code = @progMajorCode 
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('progCode',       sql.VarChar, progCode      )
                            .input('progMajorCode',  sql.VarChar, progMajorCode )
                            .query(sqlDeleteProgram);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProgram = deleteProgram;
