const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const organizationBusinessUnitExist = async (ogbuOrgCode, ogbuBuCode ) => {

    let respuesta;
    try {
        const sqlOrganizationBusinessUnitExist = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Organizacion Unidad de Negocio ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_organizations_business_units t1
                    WHERE t1.ogbu_org_code   =   @ogbuOrgCode
                    and t1.ogbu_bu_code      =   @ogbuBuCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ogbuOrgCode',    sql.VarChar,ogbuOrgCode )
                            .input('ogbuBuCode',     sql.VarChar,ogbuBuCode )
                            .query(sqlOrganizationBusinessUnitExist);

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

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllOrganizationBusinessUnits);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Organizaciones Unidad de Negocio encontrados' : 'No se encontraron Organizaciones Unidad de Negocio',
           organizationBusinessUnits: result?.recordset
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
            WHERE t1.ogbu_org_code     =   @ogbuOrgCode
              and t1.ogbu_bu_code      =   @ogbuBuCode
            ORDER BY t1.ogbu_org_code,t1.ogbu_bu_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ogbuOrgCode', sql.VarChar,ogbuOrgCode )
                            .input('ogbuBuCode',  sql.VarChar,ogbuBuCode )
                            .query(sqlGetOrganizationBusinessUnitByID);
        
        return result?.recordset[0];
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
        WHERE  (UPPER(t2.org_description)  LIKE UPPER(CONCAT('%',@ogbuName,'%')) OR
                UPPER(t3.bu_name)          LIKE UPPER(CONCAT('%',@ogbuName,'%'))) 
                AND t1.ogbu_status = 'S'            
        ORDER BY t1.ogbu_org_code,t1.ogbu_bu_code
    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ogbuName', sql.VarChar,ogbuName )
                            .query(qryFindOrganizationBusinessUnits);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Organizaciones Unidad de Negocio encontradas' : 'No se encontraron Organizaciones Unidad de Negocio',
           organizationBusinessUnits: result?.recordset
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
                    (@ogbuOrgCode
                    ,@ogbuBuCode
                    ,DBO.fncGetDate()
                    ,@ogbuStatus)
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ogbuOrgCode',    sql.VarChar, ogbuOrgCode   )             
                            .input('ogbuBuCode',     sql.VarChar, ogbuBuCode )
                            .input('ogbuStatus',     sql.VarChar, ogbuStatus   )                                                                                                                                                                                                                                
                            .query(sqlCreateOrganizationBusinessUnit);
        
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
module.exports.createOrganizationBusinessUnit = createOrganizationBusinessUnit;

const updateOrganizationBusinessUnit = async( params,ogbuOrgCode, ogbuBuCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateOrganizationBusinessUnit= `
        UPDATE tbl_organizations_business_units
           SET ${columnSet}
        WHERE  ogbu_org_code       =   @ogbuOrgCode
           and ogbu_bu_code        =   @ogbuBuCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ogbuOrgCode',    sql.VarChar, ogbuOrgCode   )             
                            .input('ogbuBuCode',     sql.VarChar, ogbuBuCode    )
                            .query(sqlUpdateOrganizationBusinessUnit);
        
        return result?.rowsAffected[0];
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
        WHERE ogbu_org_code     =   @ogbuOrgCode
          and ogbu_bu_code      =   @ogbuBuCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('ogbuOrgCode',    sql.VarChar, ogbuOrgCode )             
                            .input('ogbuBuCode',     sql.VarChar, ogbuBuCode  )
                            .query(sqlDeleteOrganizationBusinessUnit);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteOrganizationBusinessUnit = deleteOrganizationBusinessUnit;
