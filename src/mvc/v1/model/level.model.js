
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const levelExist = async (levelCode ) => {

    let respuesta;
    try {
        const sqlLevelExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Grado o Nivel Academico ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_levels t1
                    WHERE t1.level_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlLevelExist, [levelCode]);

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
module.exports.levelExist = levelExist;

const getAllLevels = async() => {

    let respuesta;
    try {
        const sqlGetAllLevels = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.level_code ASC) AS id   
                ,t1.level_code          AS "levelCode"
                ,t1.level_description   AS "levelDescription"
                ,t1.level_creation_date AS "levelCreationDate"
                ,t1.level_status        AS "levelStatus"
            FROM tbl_levels t1
            order by t1.level_code
        `;

        const result = await pool.query(sqlGetAllLevels);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Grado o Nivel Academico encontrados' : 'No se encontraron Grado o Nivel Academico',
            levels: result?.rows
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
module.exports.getAllLevels = getAllLevels;


const getLevelById = async(levelCode) => {

    try {
        
        const sqlGetLevelByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.level_code ASC) AS id   
                ,t1.level_code           AS "levelCode"
                ,t1.level_description    AS "levelDescription"
                ,t1.level_creation_date  AS "levelCreationDate"
                ,t1.level_status         AS "levelStatus"
            FROM tbl_levels t1
            WHERE t1.level_code = $1 
            order by t1.level_code
        `;

        const result = await pool.query(sqlGetLevelByID, [levelCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getLevelById = getLevelById;

const getAllLevelByName = async(levelDescription) => {

    const qryFindLevels = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.level_code ASC) AS id   
            ,t1.level_code           AS "levelCode"  
            ,t1.level_description    AS "levelDescription" 
            ,t1.level_creation_date  AS "levelCreationDate"  
            ,t1.level_status         AS "levelStatus" 
        FROM tbl_levels t1
        WHERE UPPER(t1.level_description)  LIKE UPPER(CONCAT('%',$1,'%'))
        AND t1.level_status = 'S'   
        order by t1.level_code
    `;
    
    try {
        const result = await pool.query(qryFindLevels, [levelDescription]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Grado o Nivel Academico encontradas' : 'No se encontraron Grado o Nivel Academico',
            levels: result?.rows
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
module.exports.getAllLevelByName = getAllLevelByName;

const createLevel = async ( { 
    levelCode,
    levelDescription,
    levelStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateLevel = `
                INSERT INTO tbl_levels
                        ( level_code
                         ,level_description
                         ,level_creation_date
                         ,level_status)
                VALUES
                        ($1
                        ,$2
                        ,NOW()
                        ,$3)
        `;

        const result = await pool.query(sqlCreateLevel, [levelCode, levelDescription, levelStatus]);
        
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
module.exports.createLevel = createLevel;

const updateLevel = async( params,levelCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateLevel= `
        UPDATE tbl_levels
           SET ${columnSet}
         WHERE level_code = $1
        `;

        const result = await pool.query(sqlUpdateLevel, [levelCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateLevel = updateLevel;

const deleteLevel = async (levelCode ) => {
        
    try {
        
        const sqlDeleteLevel = `
        DELETE 
          FROM tbl_levels
         WHERE level_code = $1
        `;

        const result = await pool.query(sqlDeleteLevel, [levelCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteLevel = deleteLevel;
