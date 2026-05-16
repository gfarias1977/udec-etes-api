
const { pool } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const majorOfferExist = async ( maofCampCode,maofAcademicYear,maofMajorCode,maofPlanCode,maofWktCode ) => {

    let respuesta;
    try {
        const sqlMajorOfferExists = `
            SELECT string_agg(t10.validacion, chr(13) ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Carrera Oferta ya existe.'  AS  validacion,
                            COUNT(*) AS "TOTAL"
                        FROM tbl_majors_offer t1
                    WHERE t1.maof_camp_code     = $1
                      and t1.maof_academic_year = $2
                      and t1.maof_major_code    = $3
                      and t1.maof_plan_code     = $4
                      and t1.maof_wkt_code      = $5
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const result = await pool.query(sqlMajorOfferExists, [maofCampCode, maofAcademicYear, maofMajorCode, maofPlanCode, maofWktCode]);

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
module.exports.majorOfferExist = majorOfferExist;

const getAllMajorOffers = async() => {

    let respuesta;
    try {
        const sqlGetAllMajorOffers = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.maof_academic_year, t1.maof_camp_code, t1.maof_major_code, t1.maof_plan_code, maof_wkt_code ASC) AS id 
                ,t1.maof_camp_code
                ,t1.maof_academic_year
                ,t1.maof_major_code
                ,t1.maof_plan_code
                ,t1.maof_wkt_code
                ,t1.maof_min
                ,t1.maof_offer
                ,t1.maof_offer_type
            FROM tbl_majors_offer t1
            order by t1.maof_academic_year, t1.maof_camp_code, t1.maof_major_code, t1.maof_plan_code, maof_wkt_code ASC
  
        `;

        const result = await pool.query(sqlGetAllMajorOffers);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.rows.length > 0 ? 'Carreras Oferta encontradas' : 'No se encontraron Carreras Oferta',
            majorOffers: result?.rows
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
module.exports.getAllMajorOffers = getAllMajorOffers;


const getMajorOfferById = async(maofCampCode,maofAcademicYear,maofMajorCode,maofPlanCode,maofWktCode) => {

    try {
        
        const sqlGetMajorOfferByID = `
            SELECT ROW_NUMBER() OVER(ORDER BY  t1.maof_academic_year, t1.maof_camp_code, t1.maof_major_code, t1.maof_plan_code, maof_wkt_code ASC) AS id 
                ,t1.maof_camp_code
                ,t1.maof_academic_year
                ,t1.maof_major_code
                ,t1.maof_plan_code
                ,t1.maof_wkt_code
                ,t1.maof_min
                ,t1.maof_offer
                ,t1.maof_offer_type
            FROM tbl_majors_offer t1
            WHERE t1.maof_camp_code     = $1
              and t1.maof_academic_year = $2
              and t1.maof_major_code    = $3
              and t1.maof_plan_code     = $4
              and t1.maof_wkt_code      = $5
            order by t1.maof_academic_year, t1.maof_camp_code, t1.maof_major_code, t1.maof_plan_code, maof_wkt_code ASC
        `;

        const result = await pool.query(sqlGetMajorOfferByID, [maofCampCode, maofAcademicYear, maofMajorCode, maofPlanCode, maofWktCode]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};

module.exports.getMajorOfferById = getMajorOfferById;

const createMajorOffer = async ( { 
    maofCampCode,     
    maofAcademicYear, 
    maofMajorCode,    
    maofPlanCode,    
    maofWktCode,      
    maofMin,          
    maofOffer,        
    maofOfferType    
    } ) => {
        
    let respuesta;
    try {
        
        const sqlCreateMajorOffer = `
            INSERT INTO tbl_majors_offer
                    (maof_camp_code
                    ,maof_academic_year
                    ,maof_major_code
                    ,maof_plan_code
                    ,maof_wkt_code
                    ,maof_min
                    ,maof_offer
                    ,maof_offer_type)
            VALUES
                    ($1     
                    ,$2 
                    ,$3    
                    ,$4    
                    ,$5      
                    ,$6          
                    ,$7        
                    ,$8 )  
        `;

        const result = await pool.query(sqlCreateMajorOffer, [maofCampCode, maofAcademicYear, maofMajorCode, maofPlanCode, maofWktCode, maofMin, maofOffer, maofOfferType]);
        
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
module.exports.createMajorOffer = createMajorOffer;

const updateMajorOffer = async( params, maofCampCode,maofAcademicYear,maofMajorCode,maofPlanCode,maofWktCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateMajorOffer = `
        UPDATE tbl_majors_offer
           SET ${columnSet}
        WHERE  maof_camp_code     = $1
           and maof_academic_year = $2
           and maof_major_code    = $3
           and maof_plan_code     = $4
           and maof_wkt_code      = $5
        `;

        const result = await pool.query(sqlUpdateMajorOffer, [maofCampCode, maofAcademicYear, maofMajorCode, maofPlanCode, maofWktCode]);
        
        return result?.rowCount;
    } catch (error) {
        console.log(error);
    };

};
module.exports.updateMajorOffer = updateMajorOffer;

const deleteMajorOffer = async ( maofCampCode,maofAcademicYear,maofMajorCode,maofPlanCode,maofWktCode ) => {
        
    try {
        
        const sqlDeleteMajorOffer = `
        DELETE 
          FROM tbl_majors_offer
        WHERE maof_camp_code    = $1
          and maof_academic_year = $2
          and maof_major_code    = $3
          and maof_plan_code     = $4
          and maof_wkt_code      = $5
        `;

        const result = await pool.query(sqlDeleteMajorOffer, [maofCampCode, maofAcademicYear, maofMajorCode, maofPlanCode, maofWktCode]);
        
        const affectedRows = result.rowCount;

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteMajorOffer = deleteMajorOffer;
