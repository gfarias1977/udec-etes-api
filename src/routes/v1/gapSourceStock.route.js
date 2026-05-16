const express = require('express');
const router = express.Router();
const { query,checkSchema } = require('express-validator');

const GapSourceStockController = require('../../mvc/v1/controller/gapSourceStock.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createGapSourceStockSchemaBased} = require('../../middleware/validators/gapSourceStockValidator.middleware');

router.get('/getAll/', auth,[
    query('gapstPurcCode',   'Codigo deL Area de Gestion es Requerido es obligatorio').not().isEmpty(),     
    query('gapstProcId',     'Id del Proceso es obligatorio').not().isEmpty(),     
    fieldsValidator],awaitHandlerFactory(GapSourceStockController.getAllGapSourceStockByParameters)); 

router.post('/bulkLoad/', auth,checkSchema(createGapSourceStockSchemaBased), awaitHandlerFactory(GapSourceStockController.bulkLoadStock)); 

module.exports = router;