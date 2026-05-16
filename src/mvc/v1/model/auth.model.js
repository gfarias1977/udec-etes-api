
const { pool } = require('../../../services/database');

const findOne = async( codigoUsuario, empresaId ) => {

    const qryFindUser = 
    `
    SELECT *
      FROM tbl_user t1
     WHERE t1.user_company_id   =   $1
       AND t1.user_name         =   $2
       AND t1.user_status       =   'S'
    `;
    
    try {
        const result = await pool.query(qryFindUser, [empresaId, codigoUsuario]);
        
        return result.rows[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.findOne = findOne;

const findUserByID = async( userID, companyId ) => {

    try {
        
        const sqlGetUserByID = `
        SELECT 
            t1.USER_ID AS "userId",
            t1.USER_TAXPAYER_ID AS "userRut",
            t1.USER_NAME AS "userName",
            INITCAP(TRIM(CONCAT_WS(' ', 
                t1.user_first_name, 
                t1.user_middle_name, 
                t1.user_last_name
            ))) AS "userDescription",
            t1.USER_EMAIL AS "userEmail",
            TRIM(t1.USER_STATUS) AS "userStatus",
            t1.USER_CREATION_DATE AS "userCreationDate",
            COALESCE(
                (SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'role_id', t02.role_id,
                        'role_order', t02.role_order,
                        'role_name', t02.role_name
                    )
                )
                FROM tbl_user_roles t01
                JOIN tbl_roles t02 ON t01.usro_role_id = t02.role_id
                WHERE t01.usro_user_id = t1.user_id
                    AND t02.role_status = 'S'
                ),
                '[]'::json
            ) AS "userRoles"
        FROM tbl_user t1
        WHERE t1.user_id = $1
            AND t1.user_company_id = $2
        ORDER BY t1.user_id;

    `;

        const result = await pool.query(sqlGetUserByID, [userID, companyId]);
        
        return result?.rows[0];
    } catch (error) {
        console.log(error);
    };

};
module.exports.findUserByID = findUserByID;