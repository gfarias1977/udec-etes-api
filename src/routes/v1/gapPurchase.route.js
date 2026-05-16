const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const GapPurchaseController = require('../../mvc/v1/controller/gapPurchase.controller.js');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
//const { createMajorSchema, deleteMajorSchema, updateMajorSchema } = require('../../middleware/validators/purchaseValidator.middleware');

router.get('/getAll/', auth,[
    fieldsValidator],awaitHandlerFactory(GapPurchaseController.getAllGapPurchasesByParameters)); 
module.exports = router;