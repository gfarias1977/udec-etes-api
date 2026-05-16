const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const cityExists = async ( cityCode) => {

    let respuesta;
    try {
        const sqlCityExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Ciudad ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_cities t1
                    WHERE t1.city_code      =   @cityCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('cityCode',  sql.VarChar, cityCode )
                            .query(sqlCityExists);

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
module.exports.cityExists = cityExists;

const getAllCities = async() => {

    let respuesta;
    try {
        const sqlGetAllCities = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.city_code ASC) AS id  
            ,t1.city_code	     AS cityCode
            ,t1.city_name	 AS cityName
            ,t1.city_status		 AS cityStatus
        FROM dbo.tbl_cities t1
        ORDER BY t1.city_name
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllCities);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Ciudades encontradas' : 'No se encontraron Ciudades',
            cities: result?.recordset
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
module.exports.getAllCities = getAllCities;

const getAllCitiesBibliographicCenter = async(orgCode) => {

    let respuesta;
    

    try {
        const sqlGetAllCities = `
            SELECT DISTINCT [cabi_city_code] cityCode
            FROM [dbo].[tbl_campus_bibligraphic_center]
            JOIN [dbo].[tbl_campus] ON [camp_code] = [cabi_camp_code]
            WHERE
                [camp_org_code] = coalesce(@orgCode,'')
            AND [cabi_status] = 'S'
            ORDER BY [cabi_city_code] ASC;
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('orgCode',  sql.VarChar, orgCode )                            
                            .query(sqlGetAllCities);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Ciudades centros bibliografico encontradas' : 'No se encontraron Ciudades centros bibliografico ',
            cities: result?.recordset
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
module.exports.getAllCitiesBibliographicCenter = getAllCitiesBibliographicCenter;


const createCity = async ( { 
     cityCode
    ,cityName
    ,cityStatus}) => {
        
    let respuesta;
    try {
        
        const sqlCreateCity = `
                INSERT INTO dbo.tbl_cities
                        (
                             city_code	
                            ,city_name	
                            ,city_status		
                        )
                VALUES
                        (
                             @cityCode
                            ,@cityName
                            ,@cityStatus
                        )
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('cityCode',           sql.VarChar,  cityCode )
                            .input('cityName',           sql.VarChar,  cityName )
                            .input('cityStatus',         sql.VarChar,  cityStatus )                                                                                                                                                                                                                                
                            .query(sqlCreateCity);
        
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
module.exports.createCity = createCity;

const updateCity = async( params, cityCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateCity= `
        UPDATE tbl_cities
           SET ${columnSet}
         WHERE city_code = @cityCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('cityCode',     sql.VarChar, cityCode )
                            .query(sqlUpdateCity);
        
        return result?.rowsAffected[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateCity = updateCity;

const deleteCity = async ( cityCode ) => {
        
    try {
        
        const sqlDeleteCity = `
        DELETE 
          FROM tbl_cities
         WHERE city_code = @cityCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('cityCode',    sql.VarChar, cityCode )
                            .query(sqlDeleteCity);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteCity = deleteCity;
