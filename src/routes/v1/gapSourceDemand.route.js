const express = require('express');
const router = express.Router();
const { query, checkSchema } = require('express-validator');

const GapSourceDemandController = require('../../mvc/v1/controller/gapSourceDemand.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createGapSourceDemandSchemaBased} = require('../../middleware/validators/gapSourceDemandValidator.middleware');

const normalizeDemandBody = (req, res, next) => {
    if (req.body?.data && !Array.isArray(req.body.data) && Array.isArray(req.body.data?.data)) {
        req.body = req.body.data;
    }
    next();
};

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(GapSourceDemandController.getAllGapSourceDemandByParameters)); 

    router.get('/getAllDemandPeriods/', auth,[
        fieldsValidator],awaitHandlerFactory(GapSourceDemandController.getAllDemandPeriods)); 

router.post('/bulkLoad/', auth, normalizeDemandBody, checkSchema(createGapSourceDemandSchemaBased, ['body']), awaitHandlerFactory(GapSourceDemandController.bulkLoadDemand)); 

module.exports = router;