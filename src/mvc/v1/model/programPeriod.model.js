
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const programPeriodExist = async (propCode ) => {

    let respuesta;
    try {
        const sqlProgramPeriodExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Periodo de Programa ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_programs_periods t1
                    WHERE t1.prop_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlProgramPeriodExist, [propCode]);

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
module.exports.programPeriodExist = programPeriodExist;

const getAllProgramPeriods = async() => {

    let respuesta;
    try {
        const sqlGetAllProgramPeriods = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.prop_code ASC) AS id   
                ,t1.prop_code
                ,t1.prop_name
                ,t1.prop_creation_date
                ,t1.prop_status
            FROM tbl_programs_periods t1
            order by t1.prop_code
        `;

        const result = await pool.query(sqlGetAllProgramPeriods);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Periodo de Programa encontrados' : 'No se encontraron Periodo de Programa',
            programPeriods: result?.rows
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
module.exports.getAllProgramPeriods = getAllProgramPeriods;


const getProgramPeriodById = async(propCode) => {

    try {
        
        const sqlGetLevelByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.prop_code ASC) AS id   
                ,t1.prop_code
                ,t1.prop_name
                ,t1.prop_creation_date
                ,t1.prop_status
            FROM tbl_programs_periods t1
            WHERE t1.prop_code = $1 
            order by t1.prop_code
        `;

        const result = await pool.query(sqlGetLevelByID, [propCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getProgramPeriodById = getProgramPeriodById;

const getAllProgamTypeByName = async(propName) => {

    const qryFindProgramPeriods = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.prop_code ASC) AS id   
            ,t1.prop_code
            ,t1.prop_name
            ,t1.prop_creation_date
            ,t1.prop_status
        FROM tbl_programs_periods t1
        WHERE UPPER(t1.prop_name)  LIKE UPPER(CONCAT('%',$1,'%'))
        AND t1.prop_status = 'S'   
        order by t1.prop_code
    `;
    
    try {
        const result = await pool.query(qryFindProgramPeriods, [propName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Periodo de Programa encontradas' : 'No se encontraron Periodo de Programa',
            programPeriods: result?.rows
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

const createProgramPeriod = async ( { 
    propCode,
    propName,
    propStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateProgramPeriod = `
                INSERT INTO tbl_programs_periods
                        ( prop_code
                         ,prop_name
                         ,prop_creation_date
                         ,prop_status)
                VALUES
                        ($1
                        ,$2
                        ,NOW()
                        ,$3)
        `;

        const result = await pool.query(sqlCreateProgramPeriod, [propCode, propName, propStatus]);
        
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
module.exports.createProgramPeriod = createProgramPeriod;

const updateProgramPeriod = async( params,propCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateProgramPeriod= `
        UPDATE tbl_programs_periods
           SET ${columnSet}
         WHERE prop_code = $1
        `;

        const result = await pool.query(sqlUpdateProgramPeriod, [propCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateProgramPeriod = updateProgramPeriod;

const deleteProgramPeriod = async (propCode) => {
        
    try {
        
        const sqlDeleteProgramPeriod = `
        DELETE 
          FROM tbl_programs_periods
         WHERE prop_code = $1
        `;

        const result = await pool.query(sqlDeleteProgramPeriod, [propCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteProgramPeriod = deleteProgramPeriod;
