
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const programTypeExist = async (protCode ) => {

    let respuesta;
    try {
        const sqlProgramTypeExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Tipo de Programa ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_programs_type t1
                    WHERE t1.prot_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlProgramTypeExist, [protCode]);

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
            FROM tbl_programs_type t1
            order by t1.prot_code
        `;

        const result = await pool.query(sqlGetAllProgramTypes);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Tipo de Programa encontrados' : 'No se encontraron Tipo de Programa',
            programTypes: result?.rows
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
            FROM tbl_programs_type t1
            WHERE t1.prot_code = $1 
            order by t1.prot_code
        `;

        const result = await pool.query(sqlGetLevelByID, [protCode]);
        
        return result?.rows[0];
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
        FROM tbl_programs_type t1
        WHERE UPPER(t1.prot_name)  LIKE UPPER(CONCAT('%',$1,'%'))
        AND t1.prot_status = 'S'   
        order by t1.prot_code
    `;
    
    try {
        const result = await pool.query(qryFindProgramTypes, [protName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Tipo de Programa encontradas' : 'No se encontraron Tipo de Programa',
            programTypes: result?.rows
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
                INSERT INTO tbl_programs_type
                        ( prot_code
                         ,prot_name
                         ,prot_creation_date
                         ,prot_status)
                VALUES
                        ($1
                        ,$2
                        ,NOW()
                        ,$3)
        `;

        const result = await pool.query(sqlCreateProgramType, [protCode, protName, protStatus]);
        
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
module.exports.createProgramType = createProgramType;

const updateProgramType = async( params,protCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateProgramType= `
        UPDATE tbl_programs_type
           SET ${columnSet}
         WHERE prot_code = $1
        `;

        const result = await pool.query(sqlUpdateProgramType, [protCode]);
        
        return result?.rowCount;
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
         WHERE prot_code = $1
        `;

        const result = await pool.query(sqlDeleteProgramType, [protCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProgramType = deleteProgramType;
