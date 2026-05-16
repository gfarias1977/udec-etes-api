
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const cityExists = async ( cityCode) => {

    let respuesta;
    try {
        const sqlCityExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Ciudad ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_cities t1
                    WHERE t1.city_code      =   $1
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlCityExists, [cityCode]);

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
module.exports.cityExists = cityExists;

const getAllCities = async() => {

    let respuesta;
    try {
        const sqlGetAllCities = `
        SELECT ROW_NUMBER() OVER(ORDER BY  t1.city_code ASC) AS id  
            ,t1.city_code	     AS "cityCode"
            ,t1.city_name	 AS "cityName"
            ,t1.city_status		 AS "cityStatus"
        FROM tbl_cities t1
        ORDER BY t1.city_name
        `;

        const result = await pool.query(sqlGetAllCities);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Ciudades encontradas' : 'No se encontraron Ciudades',
            cities: result?.rows
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
            FROM tbl_campus_bibligraphic_center
            JOIN tbl_campus ON [camp_code] = [cabi_camp_code]
            WHERE
                [camp_org_code] = coalesce($1,'')
            AND [cabi_status] = 'S'
            ORDER BY [cabi_city_code] ASC;
        `;

        const result = await pool.query(sqlGetAllCities, [orgCode]);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Ciudades centros bibliografico encontradas' : 'No se encontraron Ciudades centros bibliografico ',
            cities: result?.rows
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
                INSERT INTO tbl_cities
                        (
                             city_code	
                            ,city_name	
                            ,city_status		
                        )
                VALUES
                        (
                             $1
                            ,$2
                            ,$3
                        )
        `;

        const result = await pool.query(sqlCreateCity, [cityCode, cityName, cityStatus]);
        
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
module.exports.createCity = createCity;

const updateCity = async( params, cityCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateCity= `
        UPDATE tbl_cities
           SET ${columnSet}
         WHERE city_code = $1
        `;

        const result = await pool.query(sqlUpdateCity, [cityCode]);
        
        return result?.rowCount;
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
         WHERE city_code = $1
        `;

        const result = await pool.query(sqlDeleteCity, [cityCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteCity = deleteCity;
