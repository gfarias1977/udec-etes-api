
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const campusExists = async ( campCode ) => {

    let respuesta;
    try {
        const sqlCampusExists = `
          SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
            FROM (
                  SELECT 'Campus ya existe.'  AS  validacion,
                         COUNT(*) AS "TOTAL"
                    FROM tbl_campus t1
                   WHERE t1.camp_code      =   $1
                 ) t10
           WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlCampusExists, [campCode]);

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
module.exports.campusExists = campusExists;

const getAllCampus = async(campCode) => {

    let respuesta;
    try {
        const sqlGetAllCampus = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.camp_code ASC) AS id
                ,t1.camp_code            AS "campCode"              
                ,t1.camp_org_code        AS "campOrgCode"     
                ,t1.camp_description     AS "campDescription"        
                ,t1.camp_type            AS "campType" 
                ,t1.camp_address         AS "campAddress"    
                ,t1.camp_department      AS "campDepartment"       
                ,t1.camp_city            AS "campCity" 
                ,t1.camp_erp_code        AS "campErpCode"     
                ,t1.camp_creation_date   AS "campCreationDate"          
                ,t1.camp_status          AS "campStatus"   
            FROM tbl_campus t1
            LEFT JOIN tbl_organizations t2 on t2.org_code = t1.camp_org_code
            WHERE t1.camp_org_code = COALESCE($1, t1.camp_org_code)
            ORDER BY t1.camp_code desc
        `;

        const result = await pool.query(sqlGetAllCampus, [campCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Campus encontradas' : 'No se encontraron Campus',
            campus: result?.rows
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
module.exports.getAllCampus = getAllCampus;

const createCampus = async ( { 
    campCode,
    campOrgCode,
    campDescription,
    campType,
    campAddress,
    campDepartment,
    campCity,
    campErpCode,
    campStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateCampus = `
            INSERT INTO tbl_campus
                    (camp_code
                    ,camp_org_code
                    ,camp_description
                    ,camp_type
                    ,camp_address
                    ,camp_department
                    ,camp_city
                    ,camp_erp_code
                    ,camp_creation_date
                    ,camp_status)
            VALUES
                    (UPPER($1)
                    ,UPPER($2)
                    ,UPPER($3)
                    ,UPPER($4)
                    ,UPPER($5)
                    ,UPPER($6)
                    ,UPPER($7)
                    ,UPPER($8)
                    ,NOW()
                    ,UPPER($9))
        `;

        const result = await pool.query(sqlCreateCampus, [campCode, campOrgCode, campDescription, campType, campAddress, campDepartment, campCity, campErpCode, campStatus]);
        
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
module.exports.createCampus = createCampus;

const updateCampus = async( params, campCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateCampus= `
        UPDATE tbl_campus
           SET ${columnSet}
         WHERE camp_code = $1
        `;

        const result = await pool.query(sqlUpdateCampus, [campCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateCampus = updateCampus;

const deleteCampus = async ( campCode ) => {
        
    try {
        
        const sqlDeleteCampus = `
        DELETE 
          FROM tbl_campus
         WHERE camp_code = $1
        `;

        const result = await pool.query(sqlDeleteCampus, [campCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteCampus = deleteCampus;
