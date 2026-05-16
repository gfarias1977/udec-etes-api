
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const facultyExists = async ( facuCode ) => {

    let respuesta;
    try {
        const sqlFacultyExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Facultad ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_faculty t1
                    WHERE t1.facu_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlFacultyExists, [facuCode]);

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
module.exports.facultyExists = facultyExists;

const getAllFaculties = async() => {

    let respuesta;
    try {
        const sqlGetAllFaculties = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.facu_code ASC) AS id  
                ,t1.facu_code
                ,t1.facu_org_code
                ,t1.facu_name
                ,t1.facu_creation_date
                ,t1.facu_status
            FROM tbl_faculty t1
            order by t1.facu_code
        `;

        const result = await pool.query(sqlGetAllFaculties);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Facultades encontrados' : 'No se encontraron Facultades',
            faculties: result?.rows
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
module.exports.getAllFaculties = getAllFaculties;


const getFacultyById = async( facuCode) => {

    try {
        
        const sqlGetFacultyByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.facu_code ASC) AS id  
                ,t1.facu_code
                ,t1.facu_org_code
                ,t1.facu_name
                ,t1.facu_creation_date
                ,t1.facu_status
            FROM tbl_faculty t1
            WHERE t1.facu_code = $1            
            order by t1.facu_code 
        `;

        const result = await pool.query(sqlGetFacultyByID, [facuCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getFacultyById = getFacultyById;

const getAllFacultyByName = async(facuName) => {

    const qryFindFaculties = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.facu_code ASC) AS id  
            ,t1.facu_code
            ,t1.facu_org_code
            ,t1.facu_name
            ,t1.facu_creation_date
            ,t1.facu_status
        FROM tbl_faculty t1
        WHERE UPPER(t1.facu_name)  LIKE UPPER(CONCAT('%',$1,'%'))
           AND t1.facu_status = 'S'         
        order by t1.facu_code 
    `;
    
    try {
        const result = await pool.query(qryFindFaculties, [facuName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Facultades encontradas' : 'No se encontraron Facultades',
            faculties: result?.rows
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
module.exports.getAllFacultyByName = getAllFacultyByName;

const createFaculty = async ( { 
    facuCode,
    facuOrgCode,
    facuName,
    facuCreationDate,
    facuStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateFaculty = `
                INSERT INTO tbl_faculty
                        (facu_code
                        ,facu_org_code
                        ,facu_name
                        ,facu_creation_date
                        ,facu_status)
                VALUES
                        ($1
                        ,$2
                        ,$3
                        ,NOW()
                        ,$4)
        `;

        const result = await pool.query(sqlCreateFaculty, [facuCode, facuOrgCode, facuName, facuStatus]);
        
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
module.exports.createFaculty = createFaculty;

const updateFaculty = async( params, facuCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateFaculty= `
        UPDATE tbl_faculty
           SET ${columnSet}
         WHERE facu_code = $1
        `;

        const result = await pool.query(sqlUpdateFaculty, [facuCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateFaculty = updateFaculty;

const deleteFaculty = async ( facuCode ) => {
        
    try {
        
        const sqlDeleteFaculty = `
        DELETE 
          FROM tbl_faculty
         WHERE facu_code = $1
        `;

        const result = await pool.query(sqlDeleteFaculty, [facuCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteFaculty = deleteFaculty;
