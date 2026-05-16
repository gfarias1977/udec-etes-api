
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const campusFacultyExists = async ( cfacFacuCode, cfacCampCode, cfacOrgCode  ) => {

    let respuesta;
    try {
        const sqlCampusFacultyExists = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Sede - Facultad ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_campus_faculty t1
                   WHERE t1.cfac_facu_code      =   $1
                     AND t1.cfac_camp_code      =   $2
                     AND t1.cfac_org_code       =   $3
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlCampusFacultyExists, [cfacFacuCode, cfacCampCode, cfacOrgCode]);

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
module.exports.campusFacultyExists = campusFacultyExists;

const getAllCampusFaculty = async() => {

    let respuesta;
    try {
        const sqlGetAllCampusFaculty = `
            SELECT
                    ROW_NUMBER() OVER(ORDER BY  t1.cfac_facu_code,t1.cfac_camp_code,t1.cfac_org_code  ASC) AS id
                ,t3.facu_name 
                ,t1.cfac_facu_code
                ,t2.camp_description
                ,t1.cfac_camp_code
                ,t4.org_description
                ,t1.cfac_org_code
                ,t1.cfac_creation_date
                ,t1.cfac_status
            FROM tbl_campus_faculty t1, tbl_campus t2, tbl_faculty t3, tbl_organizations t4
                WHERE t1.cfac_facu_code = t3.facu_code
                AND t1.cfac_camp_code = t2.camp_code
                AND t1.cfac_org_code =  t4.org_code
                AND t3.facu_org_code = t4.org_code
                AND t2.camp_org_code = t4.org_code
            order by t1.cfac_facu_code,t1.cfac_camp_code,t1.cfac_org_code
        `;

        const result = await pool.query(sqlGetAllCampusFaculty);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Sede-Facultad encontradas' : 'No se encontraron Sede - Facultad',
            campusFaculty: result?.rows
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
module.exports.getAllCampusFaculty = getAllCampusFaculty;


const getCampusFacultyById = async( cfacFacuCode, cfacCampCode, cfacOrgCode ) => {

    try {
        
        const sqlGetCampusFacultyByID = `
                SELECT
                     ROW_NUMBER() OVER(ORDER BY  t1.cfac_facu_code,t1.cfac_camp_code,t1.cfac_org_code  ASC) AS id
                    ,t3.facu_name 
                    ,t1.cfac_facu_code
                    ,t2.camp_description
                    ,t1.cfac_camp_code
                    ,t4.org_description
                    ,t1.cfac_org_code
                    ,t1.cfac_creation_date
                    ,t1.cfac_status
                FROM tbl_campus_faculty t1, tbl_campus t2, tbl_faculty t3, tbl_organizations t4
                    WHERE t1.cfac_facu_code = t3.facu_code
                    AND t1.cfac_camp_code = t2.camp_code
                    AND t1.cfac_org_code =  t4.org_code
                    AND t3.facu_org_code = t4.org_code
                    AND t2.camp_org_code = t4.org_code
                    AND t1.cfac_facu_code = coalesce($1,t1.cfac_facu_code)
                    AND t1.cfac_camp_code = coalesce($2,t1.cfac_camp_code)
                    AND t1.cfac_org_code = coalesce($3,t1.cfac_org_code)
                order by t1.cfac_facu_code,t1.cfac_camp_code,t1.cfac_org_code
        `;

        const result = await pool.query(sqlGetCampusFacultyByID, [cfacFacuCode, cfacCampCode, cfacOrgCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getCampusFacultyById = getCampusFacultyById;

const createCampusFaculty = async ( { 
    cfacFacuCode,
    cfacCampCode,
    cfacOrgCode,
    cfacStatus
}) => {
        
    let respuesta;
    try {
        
        const sqlCreateCampusFaculty = `
                INSERT INTO tbl_campus_faculty
                        (cfac_facu_code
                        ,cfac_camp_code
                        ,cfac_org_code
                        ,cfac_creation_date
                        ,cfac_status)
                VALUES
                        ($1
                        ,$2
                        ,$3
                        ,NOW()
                        ,$4)
        `;

        const result = await pool.query(sqlCreateCampusFaculty, [cfacFacuCode, cfacCampCode, cfacOrgCode, cfacStatus]);
        
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
module.exports.createCampusFaculty = createCampusFaculty;

const updateCampusFaculty = async( params, cfacFacuCode, cfacCampCode, cfacOrgCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateCampusFaculty= `
        UPDATE tbl_campus_faculty
           SET ${columnSet}
        WHERE cfac_facu_code = $1
          AND cfac_camp_code = $2
          AND cfac_org_code  = $3
        `;

        const result = await pool.query(sqlUpdateCampusFaculty, [cfacFacuCode, cfacCampCode, cfacOrgCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateCampusFaculty = updateCampusFaculty;

const deleteCampusFaculty = async ( cfacFacuCode, cfacCampCode, cfacOrgCode ) => {
        
    try {
        
        const sqlDeleteCampusFaculty = `
        DELETE 
          FROM tbl_campus_faculty
         WHERE cfac_facu_code = $1
           AND cfac_camp_code = $2
           AND cfac_org_code  = $3
        `;

        const result = await pool.query(sqlDeleteCampusFaculty, [cfacFacuCode, cfacCampCode, cfacOrgCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteCampusFaculty = deleteCampusFaculty;
