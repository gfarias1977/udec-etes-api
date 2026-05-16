const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const StandardCourseController = require('../../mvc/v1/controller/standardCourse.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createStandardCourseSchema, deleteStandardCourseSchema, updateStandardCourseSchema, deleteStandardCourseRlayCourseSchema } = require('../../middleware/validators/standardCourseValidator.middleware');

router.get('/getAll/',auth,
    [fieldsValidator], awaitHandlerFactory(StandardCourseController.getAllStandardCourses));  

router.get('/getAllByUser/',auth, [
    query('stdcUserId', 'Id de usuario es obligatorio').not().isEmpty(),
    query('stdcStdCode', 'Código del Standard es obligatorio').not().isEmpty(),
    query('stdcPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdcVersion', 'Version es obligatorio').not().isEmpty(),
    fieldsValidator
],awaitHandlerFactory(StandardCourseController.getAllStandardCoursesByUserId));  

router.get('/getAllByStandardUserId/',auth, [
    // query('stdcUserId', 'Id de usuario es obligatorio').not().isEmpty(), // no se usa porque se usa extrae del token de autenticación
    query('stdcStdCode', 'Código del Standard es obligatorio').not().isEmpty(),
    query('stdcPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdcVersion', 'Version es obligatorio').not().isEmpty(),
    query('stdcOrgCode', 'Organizacion es obligatorio').not().isEmpty(),
    query('stdcBuCode', 'Unidad de Negocio es obligatorio').not().isEmpty(),
    query('stdcYear', 'Año es obligatorio').not().isEmpty(),
    fieldsValidator
],awaitHandlerFactory(StandardCourseController.getStandardCourseByStandardUserId));  


router.get('/getOneById/',auth, [
    query('stdcStdCode', 'Codigo de Estandar es obligatorio').not().isEmpty(),
    query('stdcOrgCode', 'Código de Organizacion es obligatorio').not().isEmpty(),
    query('stdcBuCode', 'Código de Unidad de Negocio es obligatorio').not().isEmpty(),
    query('stdcPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdcCoursCode', 'Código de Asignatura es obligatorio').not().isEmpty(),
    query('stdcRlayCode', 'Código de Recinto Prototipo es obligatorio').not().isEmpty(),
    query('stdcItemCode', 'Código Articulo es obligatorio').not().isEmpty(),
    query('stdcVersion', 'Version es obligatorio').not().isEmpty(),
    query('stdcSchoCode', 'Código de Unidad Academica es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(StandardCourseController.getStandardCourseById)); 

router.get('/getAllBySearch/',auth, [
    //query('stdCode', 'Codigo de Estandar es obligatorio')..isEmpty(),
    //query('stdOrgCode', 'Código de Organizacion es obligatorio').isEmpty(),
    //query('stdBuCode', 'Código de Unidad de Neogocio es obligatorio').not().isEmpty(),
    //query('stdPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    //query('stdYear', 'Año es obligatorio').isEmpty(),
    //query('stdVersion', 'Version es obligatorio').isEmpty(),
    //query('stdUserId', 'Id Usuario es obligatorio').not().isEmpty(),
    //query('stdPurchase', 'Disponible para Compra es obligatorio').isEmpty(),
    fieldsValidator],awaitHandlerFactory(StandardCourseController.getStandardCourseBySearch)); 

router.post('/create/', auth, createStandardCourseSchema, awaitHandlerFactory(StandardCourseController.createStandardCourse));

router.patch('/update/', auth, [
    query('stdcStdCode', 'Codigo de Estandar es obligatorio').not().isEmpty(),
    query('stdcOrgCode', 'Código de Organizacion es obligatorio').not().isEmpty(),
    query('stdcBuCode', 'Código de Unidad de Negocio es obligatorio').not().isEmpty(),
    query('stdcPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdcCoursCode', 'Código de Asignatura es obligatorio').not().isEmpty(),
    query('stdcRlayCode', 'Código de Recinto Prototipo es obligatorio').not().isEmpty(),
    query('stdcItemCode', 'Código Articulo es obligatorio').not().isEmpty(),
    query('stdcStdVersion', 'Version es obligatorio').not().isEmpty(),
    query('stdcSchoCode', 'Código de Unidad Academica es obligatorio').not().isEmpty(),
    fieldsValidator],updateStandardCourseSchema, awaitHandlerFactory(StandardCourseController.updateStandardCourse)); 

router.delete('/delete/', auth, [
    query('stdcStdCode', 'Codigo de Estandar es obligatorio').not().isEmpty(),
    query('stdcOrgCode', 'Código de Organizacion es obligatorio').not().isEmpty(),
    query('stdcBuCode', 'Código de Unidad de Negocio es obligatorio').not().isEmpty(),
    query('stdcPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdcCoursCode', 'Código de Asignatura es obligatorio').not().isEmpty(),
    query('stdcRlayCode', 'Código de Recinto Prototipo es obligatorio').not().isEmpty(),
    query('stdcItemCode', 'Código Articulo es obligatorio').not().isEmpty(),
    query('stdcStdVersion', 'Version es obligatorio').not().isEmpty(),
    query('stdcSchoCode', 'Código de Unidad Academica es obligatorio').not().isEmpty(),
    fieldsValidator],deleteStandardCourseSchema, awaitHandlerFactory(StandardCourseController.deleteStandardCourse)); 
 
router.delete('/deleteByRlayCourse/', auth, [
    query('stdcStdCode', 'Codigo de Estandar es obligatorio').not().isEmpty(),
    query('stdcOrgCode', 'Código de Organizacion es obligatorio').not().isEmpty(),
    query('stdcBuCode', 'Código de Unidad de Negocio es obligatorio').not().isEmpty(),
    query('stdcPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdcCoursCode', 'Código de Asignatura es obligatorio').not().isEmpty(),
    query('stdcRlayCode', 'Código de Recinto Prototipo es obligatorio').not().isEmpty(),
    query('stdcStdVersion', 'Version es obligatorio').not().isEmpty(),
    fieldsValidator],deleteStandardCourseRlayCourseSchema, awaitHandlerFactory(StandardCourseController.deleteStandardCourseByRlayCourseCode)); 

router.delete('/deleteAllCoursesByStandard/', auth, [
    query('stdcStdCode', 'Codigo de Estandar es obligatorio').not().isEmpty(),
    query('stdcOrgCode', 'Código de Organizacion es obligatorio').not().isEmpty(),
    query('stdcBuCode', 'Código de Unidad de Negocio es obligatorio').not().isEmpty(),
    query('stdcPurcCode', 'Código de Area de compra es obligatorio').not().isEmpty(),
    query('stdcCoursCode', 'Código de Asignatura es obligatorio').not().isEmpty(),
    query('stdcRlayCode', 'Código de Recinto Prototipo es obligatorio').not().isEmpty(),
    query('stdcStdVersion', 'Version es obligatorio').not().isEmpty(),
    fieldsValidator],deleteStandardCourseRlayCourseSchema, awaitHandlerFactory(StandardCourseController.deleteStandardCourseByRlayCourseCode)); 

module.exports = router;