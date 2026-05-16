const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const programTypeExist = async (protCode ) => {

    let respuesta;
    try {
        const sqlProgramTypeExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Tipo de Programa ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_programs_type t1
                    WHERE t1.prot_code      =   @protCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('protCode',  sql.VarChar,protCode )
                            .query(sqlProgramTypeExist);

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
module.exports.programTypeExist = programTypeExist;

const getAllProgramTypes = async() => {

    let respuesta;
    try {
        const sqlGetAllProgramTypes = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.prot_code ASC) AS id   
                ,t1.prot_code
                ,t1.prot_name
                ,t1.prot_creation_date
                ,t1.prot_status
            FROM dbo.tbl_programs_type t1
            order by t1.prot_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllProgramTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Tipo de Programa encontrados' : 'No se encontraron Tipo de Programa',
            programTypes: result?.recordset
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
module.exports.getAllProgramTypes = getAllProgramTypes;


const getProgramTypeById = async(protCode) => {

    try {
        
        const sqlGetLevelByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.prot_code ASC) AS id   
                ,t1.prot_code
                ,t1.prot_name
                ,t1.prot_creation_date
                ,t1.prot_status
            FROM dbo.tbl_programs_type t1
            WHERE t1.prot_code = @protCode 
            order by t1.prot_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('protCode', sql.VarChar,protCode )                            
                            .query(sqlGetLevelByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getProgramTypeById = getProgramTypeById;

const getAllProgamTypeByName = async(protName) => {

    const qryFindProgramTypes = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.prot_code ASC) AS id   
            ,t1.prot_code
            ,t1.prot_name
            ,t1.prot_creation_date
            ,t1.prot_status
        FROM dbo.tbl_programs_type t1
        WHERE UPPER(t1.prot_name)  LIKE UPPER(CONCAT('%',@protName,'%'))
        AND t1.prot_status = 'S'   
        order by t1.prot_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('protName', sql.VarChar, protName )
                            .query(qryFindProgramTypes);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Tipo de Programa encontradas' : 'No se encontraron Tipo de Programa',
            programTypes: result?.recordset
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
module.exports.getAllProgamTypeByName = getAllProgamTypeByName;

const createProgramType = async ( { 
    protCode,
    protName,
    protStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateProgramType = `
                INSERT INTO dbo.tbl_programs_type
                        ( prot_code
                         ,prot_name
                         ,prot_creation_date
                         ,prot_status)
                VALUES
                        (@protCode
                        ,@protName
                        ,DBO.fncGetDate()
                        ,@protStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('protCode',   sql.VarChar,  protCode   )             
                            .input('protName',   sql.VarChar,  protName   )
                            .input('protStatus', sql.VarChar,  protStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateProgramType);
        
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
module.exports.createProgramType = createProgramType;

const updateProgramType = async( params,protCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateProgramType= `
        UPDATE tbl_programs_type
           SET ${columnSet}
         WHERE prot_code = @protCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('protCode',     sql.VarChar,protCode )
                            .query(sqlUpdateProgramType);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateProgramType = updateProgramType;

const deleteProgramType = async (protCode) => {
        
    try {
        
        const sqlDeleteProgramType = `
        DELETE 
          FROM tbl_programs_type
         WHERE prot_code = @protCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('protCode',     sql.VarChar,protCode )
                            .query(sqlDeleteProgramType);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProgramType = deleteProgramType;
