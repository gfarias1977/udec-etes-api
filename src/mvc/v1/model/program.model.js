
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const programExist = async ( progCode, progMajorCode ) => {

    let respuesta;
    try {
        const sqlProgramExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Plan ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_programs t1
                    WHERE t1.prog_code       = $1
                      AND t1.prog_major_code = $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlProgramExists, [progCode, progMajorCode]);

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
module.exports.programExist = programExist;

const getAllPrograms = async() => {

    let respuesta;
    try {
        const sqlGetAllPrograms = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.prog_code, t1.prog_major_code ASC) AS id
                ,t1.prog_code           AS "progCode"          
                ,t1.prog_major_code     AS "progMajorCode"       
                ,t1.prog_prot_code      AS "progProtCode"      
                ,t1.prog_prop_code      AS "progPropCode"       
                ,t1.prog_year           AS "progYear"             
                ,t1.prog_major_name     AS "progMajorName"       
                ,t1.prog_title          AS "progTitle"           
                ,t1.prog_degre          AS "progDegre"            
                ,t1.prog_bachelor       AS "progBachelor"        
                ,t1.prog_level          AS "progLevel"                              
                ,t1.prog_creation_date  AS "progCreationDate"     
                ,t1.prog_status         AS "progStatus"           
            FROM tbl_programs t1
            ORDER BY t1.prog_code, t1.prog_major_code
        `;

        const result = await pool.query(sqlGetAllPrograms);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Planes encontrados' : 'No se encontraron Planes',
            programs: result?.rows
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
                ,t1.prog_code             AS "progCode"         
                ,t1.prog_major_code       AS "progMajorCode"     
                ,t1.prog_prot_code        AS "progProtCode"     
                ,t1.prog_prop_code        AS "progPropCode"     
                ,t1.prog_year             AS "progYear"          
                ,t1.prog_major_name       AS "progMajorName"     
                ,t1.prog_title            AS "progTitle"         
                ,t1.prog_degre            AS "progDegre"        
                ,t1.prog_bachelor         AS "progBachelor"     
                ,t1.prog_level            AS "progLevel"               
                ,t1.prog_creation_date    AS "progCreationDate"  
                ,t1.prog_status           AS "progStatus"        
            FROM tbl_programs t1
            WHERE t1.prog_code = $1
              AND t1.prog_major_code = $2
            ORDER BY t1.prog_code
        `;

        const result = await pool.query(sqlGetProgramByID, [progCode, progMajorCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getProgramById = getProgramById;

const getAllProgramsByName = async(progName) => {

    const qryFindPrograms = 
    `

        SELECT ROW_NUMBER() OVER(ORDER BY  t1.prog_code ASC) AS id
            ,t1.prog_code           AS "progCode"         
            ,t1.prog_major_code     AS "progMajorCode"    
            ,t1.prog_prot_code      AS "progProtCode"     
            ,t1.prog_prop_code      AS "progPropCode"      
            ,t1.prog_year           AS "progYear"         
            ,t1.prog_major_name     AS "progMajorName"     
            ,t1.prog_title          AS "progTitle"         
            ,t1.prog_degre          AS "progDegre"         
            ,t1.prog_bachelor       AS "progBachelor"      
            ,t1.prog_level          AS "progLevel"            
            ,t1.prog_creation_date  AS "progCreationDate"   
            ,t1.prog_status         AS "progStatus"       
        FROM tbl_programs t1
        WHERE UPPER(t1.prog_major_name)  LIKE UPPER(CONCAT('%',$1,'%'))
        AND t1.prog_status = 'S'
        ORDER BY t1.prog_code    
    `;
    
    try {
        const result = await pool.query(qryFindPrograms, [progName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Planes encontradas' : 'No se encontraron Planes',
            programs: result?.rows
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
                INSERT INTO tbl_programs
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
                         $1
                        ,$2
                        ,$3
                        ,$4
                        ,$5
                        ,$6
                        ,$7
                        ,$8
                        ,$9
                        ,$10            
                        ,NOW()
                        ,$11)    
        `;

        const result = await pool.query(sqlCreateProgram, [progCode, progMajorCode, progProtCode, progPropCode, progYear, progMajorName, progTitle, progDegre, progBachelor, progLevel, progStatus]);
        
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
module.exports.createProgram = createProgram;

const updateProgram = async( params, progCode, progMajorCode) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateProgram = `
        UPDATE tbl_programs
           SET ${columnSet}
         WHERE prog_code       = $1
           AND prog_major_code = $2
        `;

        const result = await pool.query(sqlUpdateProgram, [progCode, progMajorCode]);
        
        return result?.rowCount;
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
         WHERE prog_code       = $1
           AND prog_major_code = $2 
        `;

        const result = await pool.query(sqlDeleteProgram, [progCode, progMajorCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProgram = deleteProgram;
