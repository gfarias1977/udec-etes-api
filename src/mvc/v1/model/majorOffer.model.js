const { MAX } = require('mssql');
const { sql, poolPromise } = require('../../../services/database');
const { updateMultipleColumnSet } = require('../../../utils/common.utils');

const majorOfferExist = async ( maofCampCode,maofAcademicYear,maofMajorCode,maofPlanCode,maofWktCode ) => {

    let respuesta;
    try {
        const sqlMajorOfferExists = `
            SELECT STRING_AGG( t10.validacion, CHAR(13) ) WITHIN GROUP (ORDER BY t10.validacion)  AS  validacion
                FROM (
                    SELECT 'Carrera Oferta ya existe.'  AS  validacion,
                            COUNT(*) AS TOTAL
                        FROM tbl_majors_offer t1
                    WHERE t1.maof_camp_code     = @maofCampCode
                      and t1.maof_academic_year = @maofAcademicYear
                      and t1.maof_major_code    = @maofMajorCode
                      and t1.maof_plan_code     = @maofPlanCode
                      and t1.maof_wkt_code      = @maofWktCode
                    ) t10
            WHERE t10.TOTAL    >   0
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('maofCampCode',      sql.VarChar, maofCampCode )
                            .input('maofAcademicYear',  sql.Int, maofAcademicYear )
                            .input('maofMajorCode',    sql.VarChar, maofMajorCode )
                            .input('maofPlanCode',      sql.VarChar, maofPlanCode )
                            .input('maofWktCode',       sql.VarChar, maofWktCode )
                            .query(sqlMajorOfferExists);

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
            FROM dbo.tbl_majors_offer t1
            order by t1.maof_academic_year, t1.maof_camp_code, t1.maof_major_code, t1.maof_plan_code, maof_wkt_code ASC
  
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .query(sqlGetAllMajorOffers);

        respuesta = {
            type: 'ok',
            status: 200,
            message: result?.recordset.length > 0 ? 'Carreras Oferta encontradas' : 'No se encontraron Carreras Oferta',
            majorOffers: result?.recordset
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
            FROM dbo.tbl_majors_offer t1
            WHERE t1.maof_camp_code     = @maofCampCode
              and t1.maof_academic_year = @maofAcademicYear
              and t1.maof_major_code    = @maofMajorCode
              and t1.maof_plan_code     = @maofPlanCode
              and t1.maof_wkt_code      = @maofWktCode
            order by t1.maof_academic_year, t1.maof_camp_code, t1.maof_major_code, t1.maof_plan_code, maof_wkt_code ASC
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('maofCampCode',      sql.VarChar, maofCampCode )
                            .input('maofAcademicYear',  sql.Int, maofAcademicYear )
                            .input('maofMajorCode',    sql.VarChar, maofMajorCode )
                            .input('maofPlanCode',      sql.VarChar, maofPlanCode )
                            .input('maofWktCode',       sql.VarChar, maofWktCode )                        
                            .query(sqlGetMajorOfferByID);
        
        return result?.recordset[0];
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
                    (@maofCampCode     
                    ,@maofAcademicYear 
                    ,@maofMajorCode    
                    ,@maofPlanCode    
                    ,@maofWktCode      
                    ,@maofMin          
                    ,@maofOffer        
                    ,@maofOfferType )  
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('maofCampCode',      sql.VarChar, maofCampCode )
                            .input('maofAcademicYear',  sql.VarChar, maofAcademicYear )
                            .input('maofMajorCode',    sql.VarChar, maofMajorCode )
                            .input('maofPlanCode',      sql.VarChar, maofPlanCode )
                            .input('maofWktCode',       sql.VarChar, maofWktCode )       
                            .input('maofMin',           sql.Int, maofMin )       
                            .input('maofOffer',         sql.Int, maofOffer )       
                            .input('maofOfferType',     sql.VarChar, maofOfferType )       
                            .query(sqlCreateMajorOffer);
        
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
module.exports.createMajorOffer = createMajorOffer;

const updateMajorOffer = async( params, maofCampCode,maofAcademicYear,maofMajorCode,maofPlanCode,maofWktCode ) => {

    const { columnSet } = updateMultipleColumnSet(params);

    try {
        
        const sqlUpdateMajorOffer = `
        UPDATE tbl_majors_offer
           SET ${columnSet}
        WHERE  maof_camp_code     = @maofCampCode
           and maof_academic_year = @maofAcademicYear
           and maof_major_code    = @maofMajorCode
           and maof_plan_code     = @maofPlanCode
           and maof_wkt_code      = @maofWktCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('maofCampCode',      sql.VarChar, maofCampCode )
                            .input('maofAcademicYear',  sql.Int, maofAcademicYear )
                            .input('maofMajorCode',    sql.VarChar, maofMajorCode )
                            .input('maofPlanCode',      sql.VarChar, maofPlanCode )
                            .input('maofWktCode',       sql.VarChar, maofWktCode )     
                            .query(sqlUpdateMajorOffer);
        
        return result?.rowsAffected[0];
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
        WHERE maof_camp_code    = @maofCampCode
          and maof_academic_year = @maofAcademicYear
          and maof_major_code    = @maofMajorCode
          and maof_plan_code     = @maofPlanCode
          and maof_wkt_code      = @maofWktCode
        `;

        const pool = await poolPromise;
        const result = await pool
                            .request()
                            .input('maofCampCode',      sql.VarChar, maofCampCode )
                            .input('maofAcademicYear',  sql.VarChar, maofAcademicYear )
                            .input('maofMajorCode',    sql.VarChar, maofMajorCode )
                            .input('maofPlanCode',      sql.VarChar, maofPlanCode )
                            .input('maofWktCode',       sql.VarChar, maofWktCode ) 
                            .query(sqlDeleteMajorOffer);
        
        const affectedRows = result.rowsAffected[0];

        return affectedRows;
    } catch (error) {
        console.log(error);
    };
};

module.exports.deleteMajorOffer = deleteMajorOffer;
