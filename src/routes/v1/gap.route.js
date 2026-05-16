const express = require('express');
const router = express.Router();
const { query, checkSchema } = require('express-validator');

const GapController = require('../../mvc/v1/controller/gap.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { calculateGapSchemaBased} = require('../../middleware/validators/gapValidator.middleware');

router.get('/getAllDemandVsStock/', auth,[
    fieldsValidator],awaitHandlerFactory(GapController.getAllGapDemandVsStockByParameters)); 

router.get('/getAllStockVsDemand/', auth,[
    fieldsValidator],awaitHandlerFactory(GapController.getAllGapStockVsDemandByParameters)); 

router.get('/getAllPeriodsDda/', auth,[
    fieldsValidator],awaitHandlerFactory(GapController.getAllGapPeriodsDda)); 

router.get('/getAllPeriodsStk/', auth,[
   fieldsValidator],awaitHandlerFactory(GapController.getAllGapPeriodsStk));         

router.post('/calculation/', auth, checkSchema(calculateGapSchemaBased), awaitHandlerFactory(GapController.gapCalculation)); 

module.exports = router;