const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const ReportController = require('../../mvc/v1/controller/report.controller');
const { fieldsValidator } = require('../../middleware/validators/fieldsValidator');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');

router.get('/getReportStandardAppliedToMayor/', auth,[
    fieldsValidator],awaitHandlerFactory(ReportController.getReportStandardAppliedToMayor)); 

router.get('/getReportStandardByRoomLayout/', auth,[
    fieldsValidator],awaitHandlerFactory(ReportController.getReportStandardByRoomLayout)); 
        
router.get('/getReportEquipmentByMayor/', auth,[
    fieldsValidator],awaitHandlerFactory(ReportController.getReportEquipmentByMayor));       
    
module.exports = router;
