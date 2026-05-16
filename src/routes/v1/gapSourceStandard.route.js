const express = require('express');
const router = express.Router();
const { query, checkSchema } = require('express-validator');

const GapSourceStandardController = require('../../mvc/v1/controller/gapSourceStandard.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createGapSourceStandardSchemaBased } = require('../../middleware/validators/gapSourceStandardValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(GapSourceStandardController.getAllGapSourceStandardByParameters)); 

router.post('/bulkLoad/', auth, checkSchema(createGapSourceStandardSchemaBased), awaitHandlerFactory(GapSourceStandardController.bulkLoadStandard)); 

module.exports = router;