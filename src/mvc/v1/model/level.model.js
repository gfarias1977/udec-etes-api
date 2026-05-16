const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const levelExist = async (levelCode ) => {

    let respuesta;
    try {
        const sqlLevelExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Grado o Nivel Academico ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_levels t1
                    WHERE t1.level_code      =   @levelCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('levelCode',  sql.VarChar,levelCode )
                            .query(sqlLevelExist);

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
module.exports.levelExist = levelExist;

const getAllLevels = async() => {

    let respuesta;
    try {
        const sqlGetAllLevels = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.level_code ASC) AS id   
                ,t1.level_code          AS levelCode
                ,t1.level_description   AS levelDescription
                ,t1.level_creation_date AS levelCreationDate
                ,t1.level_status        AS levelStatus
            FROM dbo.tbl_levels t1
            order by t1.level_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllLevels);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Grado o Nivel Academico encontrados' : 'No se encontraron Grado o Nivel Academico',
            levels: result?.recordset
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
                ,t1.level_code           AS levelCode
                ,t1.level_description    AS levelDescription
                ,t1.level_creation_date  AS levelCreationDate
                ,t1.level_status         AS levelStatus
            FROM dbo.tbl_levels t1
            WHERE t1.level_code = @levelCode 
            order by t1.level_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('levelCode', sql.VarChar,levelCode )                            
                            .query(sqlGetLevelByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getLevelById = getLevelById;

const getAllLevelByName = async(levelDescription) => {

    const qryFindLevels = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.level_code ASC) AS id   
            ,t1.level_code           AS levelCode  
            ,t1.level_description    AS levelDescription 
            ,t1.level_creation_date  AS levelCreationDate  
            ,t1.level_status         AS levelStatus 
        FROM dbo.tbl_levels t1
        WHERE UPPER(t1.level_description)  LIKE UPPER(CONCAT('%',@levelDescription,'%'))
        AND t1.level_status = 'S'   
        order by t1.level_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('levelDescription', sql.VarChar, levelDescription )
                            .query(qryFindLevels);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Grado o Nivel Academico encontradas' : 'No se encontraron Grado o Nivel Academico',
            levels: result?.recordset
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
                INSERT INTO dbo.tbl_levels
                        ( level_code
                         ,level_description
                         ,level_creation_date
                         ,level_status)
                VALUES
                        (@levelCode
                        ,@levelDescription
                        ,DBO.fncGetDate()
                        ,@levelStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('levelCode',         sql.VarChar, levelCode )             
                            .input('levelDescription',  sql.VarChar,  levelDescription )
                            .input('levelStatus',       sql.VarChar,  levelStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateLevel);
        
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
module.exports.createLevel = createLevel;

const updateLevel = async( params,levelCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateLevel= `
        UPDATE tbl_levels
           SET ${columnSet}
         WHERE level_code = @levelCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('levelCode',     sql.VarChar,levelCode )
                            .query(sqlUpdateLevel);
        
        return result?.rowsAffected[0];
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
         WHERE level_code = @levelCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('levelCode',     sql.VarChar,levelCode )
                            .query(sqlDeleteLevel);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteLevel = deleteLevel;
