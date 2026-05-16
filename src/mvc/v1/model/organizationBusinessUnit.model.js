
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const organizationBusinessUnitExist = async (ogbuOrgCode, ogbuBuCode ) => {

    let respuesta;
    try {
        const sqlOrganizationBusinessUnitExist = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Organizacion Unidad de Negocio ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_organizations_business_units t1
                    WHERE t1.ogbu_org_code   =   $1
                    and t1.ogbu_bu_code      =   $2
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlOrganizationBusinessUnitExist, [ogbuOrgCode, ogbuBuCode]);

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
module.exports.organizationBusinessUnitExist =organizationBusinessUnitExist;

const getAllOrganizationBusinessUnits = async() => {

    let respuesta;
    try {
        const sqlGetAllOrganizationBusinessUnits = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.ogbu_org_code,t1.ogbu_bu_code ASC) AS id  
                ,t1.ogbu_org_code
                ,COALESCE(t2.org_description,'n/a') org_description
                ,t1.ogbu_bu_code
                ,COALESCE(t3.bu_name,'n/a') bu_name
                ,t1.ogbu_creation_date
                ,t1.ogbu_status
            FROM tbl_organizations_business_units t1
            LEFT JOIN tbl_organizations t2 ON t2.org_code = t1.ogbu_org_code
            LEFT JOIN tbl_business_units t3 ON t3.bu_code = t1.ogbu_bu_code
            ORDER BY t1.ogbu_org_code,t1.ogbu_bu_code
        `;

        const result = await pool.query(sqlGetAllOrganizationBusinessUnits);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Organizaciones Unidad de Negocio encontrados' : 'No se encontraron Organizaciones Unidad de Negocio',
           organizationBusinessUnits: result?.rows
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
module.exports.getAllOrganizationBusinessUnits = getAllOrganizationBusinessUnits;


const getOrganizationBusinessUnitById = async(ogbuOrgCode, ogbuBuCode) => {

    try {
        
        const sqlGetOrganizationBusinessUnitByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY t1.ogbu_org_code,t1.ogbu_bu_code ASC) AS id  
                ,t1.ogbu_org_code
                ,COALESCE(t2.org_description,'n/a') org_description
                ,t1.ogbu_bu_code
                ,COALESCE(t3.bu_name,'n/a') bu_name
                ,t1.ogbu_creation_date
                ,t1.ogbu_status
            FROM tbl_organizations_business_units t1
            LEFT JOIN tbl_organizations t2 ON t2.org_code = t1.ogbu_org_code
            LEFT JOIN tbl_business_units t3 ON t3.bu_code = t1.ogbu_bu_code            
            WHERE t1.ogbu_org_code     =   $1
              and t1.ogbu_bu_code      =   $2
            ORDER BY t1.ogbu_org_code,t1.ogbu_bu_code
        `;

        const result = await pool.query(sqlGetOrganizationBusinessUnitByID, [ogbuOrgCode, ogbuBuCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getOrganizationBusinessUnitById = getOrganizationBusinessUnitById;

const getAllOrganizationBusinessUnitByName = async(ogbuName) => {

    const qryFindOrganizationBusinessUnits = 
    `
       SELECT ROW_NUMBER() OVER(ORDER BY t1.ogbu_org_code,t1.ogbu_bu_code ASC) AS id  
            ,t1.ogbu_org_code
            ,COALESCE(t2.org_description,'n/a') org_description
            ,t1.ogbu_bu_code
            ,COALESCE(t3.bu_name,'n/a') bu_name
            ,t1.ogbu_creation_date
            ,t1.ogbu_status
        FROM tbl_organizations_business_units t1
        LEFT JOIN tbl_organizations t2 ON t2.org_code = t1.ogbu_org_code
        LEFT JOIN tbl_business_units t3 ON t3.bu_code = t1.ogbu_bu_code
        WHERE  (UPPER(t2.org_description)  LIKE UPPER(CONCAT('%',$1,'%')) OR
                UPPER(t3.bu_name)          LIKE UPPER(CONCAT('%',$1,'%'))) 
                AND t1.ogbu_status = 'S'            
        ORDER BY t1.ogbu_org_code,t1.ogbu_bu_code
    `;
    
    try {
        const result = await pool.query(qryFindOrganizationBusinessUnits, [ogbuName]);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Organizaciones Unidad de Negocio encontradas' : 'No se encontraron Organizaciones Unidad de Negocio',
           organizationBusinessUnits: result?.rows
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
module.exports.getAllOrganizationBusinessUnitByName = getAllOrganizationBusinessUnitByName;

const createOrganizationBusinessUnit = async ( { 
    ogbuOrgCode,
    ogbuBuCode,
    ogbuStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateOrganizationBusinessUnit = `
            INSERT INTO tbl_organizations_business_units
                    (ogbu_org_code
                    ,ogbu_bu_code
                    ,ogbu_creation_date
                    ,ogbu_status)
            VALUES
                    ($1
                    ,$2
                    ,NOW()
                    ,$3)
        `;

        const result = await pool.query(sqlCreateOrganizationBusinessUnit, [ogbuOrgCode, ogbuBuCode, ogbuStatus]);
        
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
module.exports.createOrganizationBusinessUnit = createOrganizationBusinessUnit;

const updateOrganizationBusinessUnit = async( params,ogbuOrgCode, ogbuBuCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateOrganizationBusinessUnit= `
        UPDATE tbl_organizations_business_units
           SET ${columnSet}
        WHERE  ogbu_org_code       =   $1
           and ogbu_bu_code        =   $2
        `;

        const result = await pool.query(sqlUpdateOrganizationBusinessUnit, [ogbuOrgCode, ogbuBuCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateOrganizationBusinessUnit = updateOrganizationBusinessUnit;

const deleteOrganizationBusinessUnit = async (ogbuOrgCode, ogbuBuCode ) => {
        
    try {
        
        const sqlDeleteOrganizationBusinessUnit = `
        DELETE 
          FROM tbl_organizations_business_units
        WHERE ogbu_org_code     =   $1
          and ogbu_bu_code      =   $2
        `;

        const result = await pool.query(sqlDeleteOrganizationBusinessUnit, [ogbuOrgCode, ogbuBuCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteOrganizationBusinessUnit = deleteOrganizationBusinessUnit;
