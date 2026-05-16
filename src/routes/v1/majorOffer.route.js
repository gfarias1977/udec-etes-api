const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const MajorOfferController = require('../../mvc/v1/controller/majorOffer.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createMajorOfferSchema, deleteMajorOfferSchema, updateMajorOfferSchema } = require('../../middleware/validators/majorOfferValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(MajorOfferController.getAllMajorOffers)); 

router.get('/getOneById/', auth,[
    query('maofCampCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
    query('maofAcademicYear', 'Año Academico es obligatorio').not().isEmpty(),
    query('maofMajorCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    query('maofPlanCode', 'Codigo del Plan es obligatorio').not().isEmpty(),
    query('maofWktCode', 'Codigo de la Jornada es obligatorio').not().isEmpty(),
    fieldsValidator],awaitHandlerFactory(MajorOfferController.getMajorOfferById)); 

router.post('/create/', auth, createMajorOfferSchema, awaitHandlerFactory(MajorOfferController.createMajorOffer)); 

router.patch('/update/', auth,[
    query('maofCampCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
    query('maofAcademicYear', 'Año Academico es obligatorio').not().isEmpty(),
    query('maofMajorCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    query('maofPlanCode', 'Codigo del Plan es obligatorio').not().isEmpty(),
    query('maofWktCode', 'Codigo de la Jornada es obligatorio').not().isEmpty(),
    fieldsValidator], updateMajorOfferSchema, awaitHandlerFactory(MajorOfferController.updateMajorOffer)); 

router.delete('/delete/', auth,[
    query('maofCampCode', 'Codigo de la Sede es obligatorio').not().isEmpty(),
    query('maofAcademicYear', 'Año Academico es obligatorio').not().isEmpty(),
    query('maofMajorCode', 'Codigo de la Carrera es obligatorio').not().isEmpty(),
    query('maofPlanCode', 'Codigo del Plan es obligatorio').not().isEmpty(),
    query('maofWktCode', 'Codigo de la Jornada es obligatorio').not().isEmpty(),
    fieldsValidator], deleteMajorOfferSchema, awaitHandlerFactory(MajorOfferController.deleteMajorOffer)); 

module.exports = router;