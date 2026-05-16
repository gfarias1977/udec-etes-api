const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const organizationExists = async ( orgCode ) => {

    let respuesta;
    try {
        const sqlOrganizationExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Organizacion de compra ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_organizations t1
                    WHERE t1.org_code     =  @orgCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgCode',  sql.VarChar, orgCode )
                            .query(sqlOrganizationExists);

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
module.exports.organizationExists = organizationExists;

const getAllOrganizations = async() => {

    let respuesta;
    try {
        const sqlGetAllOrganizations = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.org_code ASC) AS id
                ,t1.org_code             AS orgCode                 
                ,t1.org_description      AS orgDescription    
                ,t1.org_tax_payer_id     AS orgTaxPayerId        
                ,t1.org_address          AS orgAddress        
                ,t1.org_department       AS orgDepartment      
                ,t1.org_city             AS orgCity                 
                ,t1.org_erp_code         AS orgErpCode        
                ,t1.org_uo               AS orgUo              
                ,t1.org_legal_entity_id  AS orgLegalEntityId  
                ,t1.org_ledger_id        AS orgLedgerId        
                ,t1.org_creation_date    AS orgCreationDate   
                ,t1.org_status           AS orgStatus        
            FROM dbo.tbl_organizations t1
            ORDER BY t1.org_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllOrganizations);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Organizaciones encontradas' : 'No se encontraron Organizaciones',
            organizations: result?.recordset
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
module.exports.getAllOrganizations = getAllOrganizations;


const getOrganizationById = async( orgCode ) => {

    try {
        
        const sqlGetOrganizationByID = `
                SELECT ROW_NUMBER() OVER(ORDER BY  t1.org_code ASC) AS id
                    ,t1.org_code            AS orgCode              
                    ,t1.org_description     AS orgDescription    
                    ,t1.org_tax_payer_id    AS orgTaxPayerId   
                    ,t1.org_address         AS orgAddress        
                    ,t1.org_department      AS orgDepartment     
                    ,t1.org_city            AS orgCity           
                    ,t1.org_erp_code        AS orgErpCode       
                    ,t1.org_uo              AS orgUo              
                    ,t1.org_legal_entity_id AS orgLegalEntityId
                    ,t1.org_ledger_id       AS orgLedgerId      
                    ,t1.org_creation_date   AS orgCreationDate   
                    ,t1.org_status          AS orgStatus                    
                FROM dbo.tbl_organizations t1
                WHERE t1.org_code = @orgCode
                ORDER BY t1.org_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgCode', sql.VarChar, orgCode )                            
                            .query(sqlGetOrganizationByID);
        
        return result?.recordset[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getOrganizationById = getOrganizationById;

const getAllOrganizationsByName = async(orgDescription) => {

    const qryFindOrganizations = 
    `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.org_code ASC) AS id
            ,t1.org_code              AS orgCode           
            ,t1.org_description       AS orgDescription    
            ,t1.org_tax_payer_id      AS orgTaxPayerId   
            ,t1.org_address           AS orgAddress        
            ,t1.org_department        AS orgDepartment     
            ,t1.org_city              AS orgCity           
            ,t1.org_erp_code          AS orgErpCode       
            ,t1.org_uo                AS orgUo             
            ,t1.org_legal_entity_id   AS orgLegalEntityId
            ,t1.org_ledger_id         AS orgLedgerId      
            ,t1.org_creation_date     AS orgCreationDate  
            ,t1.org_status            AS orgStatus         
        FROM dbo.tbl_organizations t1
        WHERE UPPER(t1.org_description)  LIKE UPPER(CONCAT('%',@orgDescription,'%'))
        ORDER BY t1.org_code

    `;
    
    try {
        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgDescription', sql.VarChar, orgDescription )
                            .query(qryFindOrganizations);
        
        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Organizaciones encontradas' : 'No se encontraron Organizaciones',
            organizations: result?.recordset
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
module.exports.getAllOrganizationsByName = getAllOrganizationsByName;

const getAllOrganizationsByUserId = async(orgUserId) => {

    let respuesta;
    try {
        const sqlGetAllOrganizations = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t0.org_code ASC) AS id, t0.* FROM (
                SELECT DISTINCT 
                    t1.org_code                AS orgCode           
                    ,t1.org_description        AS orgDescription   
                    ,t1.org_tax_payer_id       AS orgTaxPayerId   
                    ,t1.org_address            AS orgAddress       
                    ,t1.org_department         AS orgDepartment     
                    ,t1.org_city               AS orgCity           
                    ,t1.org_erp_code           AS orgErpCode         
                    ,t1.org_uo                 AS orgUo                 
                    ,t1.org_legal_entity_id    AS orgLegalEntityId   
                    ,t1.org_ledger_id          AS orgLedgerId          
                    ,t1.org_creation_date      AS orgCreationDate       
                    ,t1.org_status             AS orgStatus             
                FROM dbo.tbl_organizations t1
                LEFT JOIN dbo.tbl_organizations_business_units t2 ON t2.ogbu_org_code = t1.org_code
                WHERE t2.ogbu_bu_code in 
                (
                    SELECT usbu_bu_code FROM dbo.tbl_users_business_units
                    WHERE usbu_user_id = @orgUserId
                    and usbu_status = 'S'
                )
            ) t0  ORDER BY t0.org_code
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgUserId', sql.Int, orgUserId )
                            .query(sqlGetAllOrganizations);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Organizaciones encontradas' : 'No se encontraron Organizaciones',
            organizations: result?.recordset
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
module.exports.getAllOrganizationsByUserId = getAllOrganizationsByUserId;

const createOrganization = async ( { 
     orgCode
    ,orgDescription
    ,orgTaxPayerId
    ,orgAddress
    ,orgDepartment
    ,orgCity
    ,orgErpCode
    ,orgUo
    ,orgLegalEntityId
    ,orgLedgerId
    ,orgCreationDate
    ,orgStatus
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateOrganization = `
                INSERT INTO [dbo].[tbl_organizations]
                        ([org_code]
                        ,[org_description]
                        ,[org_tax_payer_id]
                        ,[org_address]
                        ,[org_department]
                        ,[org_city]
                        ,[org_erp_code]
                        ,[org_uo]
                        ,[org_legal_entity_id]
                        ,[org_ledger_id]
                        ,[org_creation_date]
                        ,[org_status])
                VALUES
                        (@orgCode
                        ,@orgDescription
                        ,@orgTaxPayerId
                        ,@orgAddress
                        ,@orgDepartment
                        ,@orgCity
                        ,@orgErpCode
                        ,@orgUo
                        ,@orgLegalEntityId
                        ,@orgLedgerId
                        ,DBO.fncGetDate()
                        ,@orgStatus)      
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgCode',          sql.VarChar,orgCode)        
                            .input('orgDescription',   sql.VarChar,orgDescription)  
                            .input('orgTaxPayerId',    sql.VarChar,orgTaxPayerId)   
                            .input('orgAddress',       sql.VarChar,orgAddress)    
                            .input('orgDepartment',    sql.VarChar,orgDepartment)
                            .input('orgCity',          sql.VarChar,orgCity)    
                            .input('orgErpCode',       sql.VarChar,orgErpCode)      
                            .input('orgUo',            sql.VarChar,orgUo)       
                            .input('orgLegalEntityId', sql.VarChar,orgLegalEntityId)
                            .input('orgLedgerId',      sql.VarChar,orgLedgerId) 
                            .input('orgStatus',      sql.VarChar,orgStatus)      
                            .query(sqlCreateOrganization);
        
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
module.exports.createOrganization = createOrganization;

const updateOrganization = async( params, orgCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateOrganization = `
        UPDATE tbl_organizations
           SET ${columnSet}
         WHERE org_code = @orgCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgCode', sql.VarChar, orgCode )
                            .query(sqlUpdateOrganization);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateOrganization = updateOrganization;

const deleteOrganization = async ( orgCode ) => {
        
    try {
        
        const sqlDeleteoOganization = `
        DELETE 
          FROM tbl_organizations
         WHERE org_code = @orgCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgCode',     sql.VarChar, orgCode )
                            .query(sqlDeleteoOganization);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteOrganization = deleteOrganization;
