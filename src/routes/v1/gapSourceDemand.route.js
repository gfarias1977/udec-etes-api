const express = require('express');
const router = express.Router();
const { query, checkSchema } = require('express-validator');

const GapSourceDemandController = require('../../mvc/v1/controller/gapSourceDemand.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createGapSourceDemandSchemaBased} = require('../../middleware/validators/gapSourceDemandValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(GapSourceDemandController.getAllGapSourceDemandByParameters)); 

    router.get('/getAllDemandPeriods/', auth,[
        fieldsValidator],awaitHandlerFactory(GapSourceDemandController.getAllDemandPeriods)); 

router.post('/bulkLoad/', auth, checkSchema(createGapSourceDemandSchemaBased), awaitHandlerFactory(GapSourceDemandController.bulkLoadDemand)); 

module.exports = router;