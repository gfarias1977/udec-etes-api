
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const schoolExists = async ( schoCode, schoOrgCode ) => {

    let respuesta;
    try {
        const sqlSchoolExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Unidad Academica ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_schools t1
                    WHERE t1.scho_code     =  $1
                      AND t1.scho_org_code = $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlSchoolExists, [schoCode, schoOrgCode]);

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
module.exports.schoolExists = schoolExists;

const getAllSchools = async() => {

    let respuesta;
    try {
        const sqlGetAllSchools = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.scho_code ASC) AS id
            ,t1.scho_code              AS "schoCode"             
            ,t1.scho_org_code          AS "schoOrgCode"
            ,t2.org_description        AS "schoOrgDescription"
            ,t1.scho_cacc_code         AS "schoCaccCode"
            ,t3.cacc_description       AS "schoCaccDescription"
            ,t1.scho_bu_code           AS "schoBuCode"
            ,t4.bu_name                AS "schoBuName"
            ,t1.scho_description       AS "schoDescription"
            ,t1.scho_registration_date AS "schoRegistrationDate"
            ,t1.scho_status            AS "schoStatus"
            ,CONCAT(t1.scho_code, '-' ,t1.scho_description)   AS "schoOptionLabel"
        FROM tbl_schools t1
        left join tbl_organizations  t2 on t2.org_code   = t1.scho_org_code 
        left join tbl_charge_account t3 on t3.cacc_code  = t1.scho_cacc_code and t3.cacc_org_code = t1.scho_org_code 
        left join tbl_business_units t4 on t4.bu_code    = t1.scho_bu_code
        ORDER BY t1.scho_code
        `;

        const result = await pool.query(sqlGetAllSchools);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Unidades Academicas encontradas' : 'No se encontraron Unidades Academicas',
            schools: result?.rows
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
module.exports.getAllSchools = getAllSchools;


const getSchoolById = async( schoCode, schoOrgCode ) => {

    try {
        
        const sqlGetSchoolByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.scho_code ASC) AS id
                ,t1.scho_code              AS "schoCode"             
                ,t1.scho_org_code          AS "schoOrgCode"
                ,t1.scho_cacc_code         AS "schoCaccCode"
                ,t1.scho_bu_code           AS "schoBuCode"
                ,t1.scho_description       AS "schoDescription"
                ,t1.scho_registration_date AS "schoRegistrationDate"
                ,t1.scho_status            AS "schoStatus"
            FROM tbl_schools t1
            WHERE t1.scho_code = $1
              AND t1.scho_org_code = $2
            ORDER BY t1.scho_code
        `;

        const result = await pool.query(sqlGetSchoolByID, [schoCode, schoOrgCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getSchoolById = getSchoolById;

const getAllSchoolsByName = async(schoDescription) => {

    const qryFindSchools = 
    `

        SELECT ROW_NUMBER() OVER(ORDER BY  t1.scho_code ASC) AS id
            ,t1.scho_code              AS "schoCode"             
            ,t1.scho_org_code          AS "schoOrgCode"
            ,t1.scho_cacc_code         AS "schoCaccCode"
            ,t1.scho_bu_code           AS "schoBuCode"
            ,t1.scho_description       AS "schoDescription"
            ,t1.scho_registration_date AS "schoRegistrationDate"
            ,t1.scho_status            AS "schoStatus"
        FROM tbl_schools t1
        WHERE UPPER(t1.scho_description)  LIKE UPPER(CONCAT('%',$1,'%'))
        AND t1.scho_status = 'S'
        ORDER BY t1.scho_code    
    `;
    
    try {
        const result = await pool.query(qryFindSchools, [schoDescription]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Unidades Academicas encontradas' : 'No se encontraron Unidades Academicas',
            schools: result?.rows
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
module.exports.getAllSchoolsByName = getAllSchoolsByName;

const getAllSchoolsByOrgCode = async(schoOrgCode, schoCaccCode) => {

    let respuesta;
    try {
        const sqlGetAllSchools = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.scho_code ASC) AS id
                ,t1.scho_code              AS "schoCode"             
                ,t1.scho_org_code          AS "schoOrgCode"
                ,t1.scho_cacc_code         AS "schoCaccCode"
                ,t1.scho_bu_code           AS "schoBuCode"
                ,t1.scho_description       AS "schoDescription"
                ,t1.scho_registration_date AS "schoRegistrationDate"
                ,t1.scho_status            AS "schoStatus"
            FROM tbl_schools t1
            JOIN tbl_charge_account t2 ON t1.scho_cacc_code = t2.cacc_code
            WHERE t1.scho_org_code = $1
            AND UPPER(t2.cacc_code) LIKE UPPER(CONCAT($2,'%')) 
            AND t1.scho_status = 'S'
            ORDER BY t1.scho_code
        `;

        const result = await pool.query(sqlGetAllSchools, [schoOrgCode, schoCaccCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Unidades Academicas encontradas' : 'No se encontraron Unidades Academicas',
            schools: result?.rows
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
module.exports.getAllSchoolsByOrgCode = getAllSchoolsByOrgCode;

const createSchool = async ( { 
         schoCode
        ,schoOrgCode
        ,schoCaccCode
        ,schoBuCode
        ,schoDescription
        ,schoStatus
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateSchool = `
                INSERT INTO tbl_schools
                        (scho_code
                        ,scho_org_code
                        ,scho_cacc_code
                        ,scho_bu_code
                        ,scho_description
                        ,scho_registration_date
                        ,scho_status)
                VALUES
                        ($1
                        ,$2
                        ,$3
                        ,$4
                        ,$5
                        ,NOW()
                        ,$6)    
        `;

        const result = await pool.query(sqlCreateSchool, [schoCode, schoOrgCode, schoCaccCode, schoBuCode, schoDescription, schoStatus]);
        
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
module.exports.createSchool = createSchool;

const updateSchool = async( params, schoCode, schoOrgCode) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateSchool = `
        UPDATE tbl_schools
           SET ${columnSet}
         WHERE scho_code     = $1
           AND scho_org_code = $2
        `;

        const result = await pool.query(sqlUpdateSchool, [schoCode, schoOrgCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateSchool = updateSchool;

const deleteSchool = async ( schoCode , schoOrgCode) => {
        
    try {
        
        const sqlDeleteSchool = `
        DELETE 
          FROM tbl_schools
         WHERE scho_code     = $1
           AND scho_org_code = $2 
        `;

        const result = await pool.query(sqlDeleteSchool, [schoCode, schoOrgCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteSchool = deleteSchool;
