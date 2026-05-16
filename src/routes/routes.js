const express = require('express');
const v1 = express();
const swaggerDocV1 = express();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json')
//const YAML = require('yamljs');
//const v1_swaggerDocument = YAML.load('./api-docs/v1.swagger.yaml');

var options = {}

//swaggerDocV1.use('/', swaggerUi.serveFiles( v1_swaggerDocument, options ), swaggerUi.setup(v1_swaggerDocument));

// Endpoint para autehtication de usuarios
v1.use('/auth', require('./v1/auth.route'));

//Endpoint para el CRUD de usuarios
v1.use('/users', require('./v1/users.route'));

//Endpoint para el CRUD de UserRole (Usuarios Roles)
v1.use('/userRoles', require('./v1/userRole.route'));

//Endpoint para el CRUD de roles de usuarios (Role)
v1.use('/roles', require('./v1/role.route'));

//Endpoint para el CRUD de roles de usuarios (Role)
v1.use('/roleApplications', require('./v1/roleApplication.route'));

//Endpoint para el CRUD de Aplicaciones (Application)
v1.use('/applications', require('./v1/application.route'));

//Endpoint para el CRUD de estandares (Standard)
v1.use('/standards', require('./v1/standard.route'));

//Endpoint para el CRUD de estandares asignaturas (Standard Courses)
v1.use('/standardCourses', require('./v1/standardCourse.route'));

//Endpoint para el CRUD de Areas de Compra (Purchase Areas)
v1.use('/purchaseAreas', require('./v1/purchaseArea.route'));

//Endpoint para el CRUD de Instituciones (Organizations)
v1.use('/organizations', require('./v1/organization.route'));

//Endpoint para el CRUD de Unidades de Negocio (Business Units)
v1.use('/organizationBusinessUnits', require('./v1/organizationBusinessUnit.route'));

//Endpoint para el CRUD de Program (Planes)
v1.use('/programs', require('./v1/program.route'));

//Endpoint para el CRUD de Program Type (Tipos de Plan)
v1.use('/programTypes', require('./v1/programType.route'));

//Endpoint para el CRUD de Program Periods (Periodos de plan)
v1.use('/programPeriods', require('./v1/programPeriod.route'));

//Endpoint para el CRUD de Campus (Sedes)
v1.use('/campus', require('./v1/campus.route'));

//Endpoint para el CRUD de la relacion entre Campus - Faculty (Sedes - Facultad)
v1.use('/campusFaculties', require('./v1/campusFaculty.route'));

//Endpoint para el CRUD de Charge Account (Centros de Costo)
v1.use('/chargeAccounts', require('./v1/chargeAccount.route'));

//Endpoint para el CRUD de Courses (Carreras)
v1.use('/courses', require('./v1/course.route'));

//Endpoint para el CRUD de Items (Clases de Articulos)
v1.use('/items', require('./v1/item.route'));

//Endpoint para el CRUD de Item Attributes (Atributos de Clases Bienes)
v1.use('/itemAttributes', require('./v1/itemAttribute.route')); 

//Endpoint para el CRUD de Item Category (Familias Subfamilias para Clasificacion de Bienes)
v1.use('/itemCategories', require('./v1/itemCategory.route')); 

//Endpoint para el CRUD de Faculty (Facultades)
v1.use('/faculties', require('./v1/faculty.route'));

//Endpoint para el CRUD de Unidades Academicas (School)
v1.use('/schools', require('./v1/school.route'));

//Endpoint para el CRUD de Unidades de Negocio (Business Units)
v1.use('/businessUnits', require('./v1/businessUnit.route'));

//Endpoint para el CRUD de Unidades de Negocio (Business Units) 
v1.use('/activities', require('./v1/activity.route'));

//Endpoint para el CRUD de Layout Data Type (Tipos de Layout)
v1.use('/layoutDataTypes', require('./v1/layoutDataType.route'));

//Endpoint para el CRUD de Room Layout Type (Recintos Tipo)
v1.use('/roomLayouts', require('./v1/roomLayout.route'));

//Endpoint para el CRUD de Room Layout Type (Recintos Tipo)
v1.use('/roomLayoutTypes', require('./v1/roomLayoutType.route'));

//Endpoint para el CRUD de Room Layout Type (Recintos Tipo)
v1.use('/roomLayoutData', require('./v1/roomLayoutData.route'));

//Endpoint para el CRUD de Layout Data Type (Tipos de Layout)
v1.use('/levels', require('./v1/level.route'));

//Endpoint para el CRUD de Major (Carreras)
v1.use('/majors', require('./v1/major.route'));

//Endpoint para el CRUD de Major Offer (Carreras Oferta)
v1.use('/majorOffers', require('./v1/majorOffer.route'));

//Endpoint para el CRUD de workTime (Jornada)
v1.use('/worktimes', require('./v1/workTime.route'));

//Endpoint para el CRUD de UserChargeAccount (Usuarios Centros de Costo)
v1.use('/userChargeAccounts', require('./v1/userChargeAccount.route'));

//Endpoint para el CRUD de UserCampus (Usuarios Sede)
v1.use('/userCampus', require('./v1/userCampus.route'));

//Endpoint para el CRUD de UserBusinessUnit (Usuarios Unidad de Negocio)
v1.use('/userBusinessUnits', require('./v1/userBusinessUnit.route'));

//Endpoint para el CRUD de UserPurchaseArea (Usuarios Area de Compra)
v1.use('/userPurchaseAreas', require('./v1/userPurchaseArea.route'));

//Endpoint para el CRUD de RealStateRoomTye (Recintos Tipo)
v1.use('/realStateRoomTypes', require('./v1/realStateRoomType.route'));

//Endpoint para el CRUD de Process (Procesos de carga de fuentes de datos)
v1.use('/processes', require('./v1/process.route'));

//Endpoint para el CRUD de Process (Procesos de carga de fuentes de datos)
v1.use('/gapsSourceStock', require('./v1/gapSourceStock.route'));

//Endpoint para el CRUD de Process (Procesos de carga de fuentes de datos)
v1.use('/gapsSourceDemand', require('./v1/gapSourceDemand.route'));

//Endpoint para el CRUD de Process (Procesos de carga de fuentes de datos)
v1.use('/gapsSourceStandard', require('./v1/gapSourceStandard.route'));

//Endpoint para el CRUD de Format Types (Procesos de carga de fuentes de datos Formato de Bibliografia)
v1.use('/formatTypes', require('./v1/formatType.route'));

//Endpoint para el CRUD de Volume (Procesos de carga de fuentes de datos Tipo de Volumenes)
v1.use('/volumeTypes', require('./v1/volumeType.route'));

//Endpoint para el CRUD de City (Procesos de carga de fuentes de datos Ciudades)
v1.use('/cities', require('./v1/city.route'));

//Endpoint para reportes de estandares)
v1.use('/reports', require('./v1/report.route'));

//Endpoint para el CRUD de Process (Procesos de carga de fuentes de datos)
v1.use('/gaps', require('./v1/gap.route'));

//Endpoint para el recuperar compras brechas stopck cero (Procesos compras stock cero)
v1.use('/purchases', require('./v1/gapPurchase.route'));

//Endpoint para la documentacion swagger del proyecto
v1.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

module.exports = { 
    //swaggerDocV1,
    v1,
};