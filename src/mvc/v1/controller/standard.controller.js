const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const StandardModel = require('../model/standard.model');

const getAllStandarsByUserId = async( req, res, next ) => {

    try {
        const userId = req.userId;
        const { filterOptions, searchTerm, filterSelect, businessUnitCode, purchaseAreaCode } = req.query;
        const standards = await StandardModel.getAllStandardsByUserId( userId, businessUnitCode, purchaseAreaCode );

        if(standards.type === 'ok'){
            const filterLength = filterOptions ? filterOptions?.length : 0;
            let filteredStandards = standards.standards;
            
            if (searchTerm || filterSelect || filterLength > 0) {
                if (searchTerm && filterLength > 0) {
                    filteredStandards = filteredStandards.filter(
                        standard => standard.stdCode.toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) && filterOptions.includes(standard.stdStatus) ||
                                (standard.stdName).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) && filterOptions.includes(standard.stdStatus) ||
                                (standard.stdBuName).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) && filterOptions.includes(standard.stdStatus) ||
                                (standard.stdOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) && filterOptions.includes(standard.stdStatus) ||
                                (standard.stdPurcDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) && filterOptions.includes(standard.stdStatus) ||
                                String(standard.stdYear).toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) && filterOptions.includes(standard.stdStatus),
                    );
                } else if (searchTerm) { 
                    filteredStandards = filteredStandards.filter(standard => standard.stdCode.toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdName).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdBuName).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdPurcDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || String( standard.stdYear ).toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
                }else if (filterSelect) {
                    filteredStandards = filteredStandards.filter(standard => standard.stdCode.toLowerCase().includes((filterSelect).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdOrgCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((filterSelect).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdPurcCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((filterSelect).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
                } //else {
                  //  filteredStandards = filteredStandards.filter(standard => filterOptions.includes(standard.stdStatus));
                //}
            };
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: standards.message,
                standards: filteredStandards
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: standards.status,
                mensaje: standards.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getStandardById = async( req, res, next ) => {

    const stdCode= req.query.stdCode;   
    const stdOrgCode= req.query.stdOrgCode;
    const stdBuCode= req.query.stdBuCode; 
    const stdPurcCode= req.query.stdPurcCode;
    const stdYear= req.query.stdYear;
    const stdVersion= req.query.stdVersion;
    const stdUserId= req.query.stdUserId;
    

    const standard = await StandardModel.getStandardById(stdCode, stdOrgCode, stdBuCode, stdPurcCode, stdYear, stdVersion, stdUserId );
    
    if(standard){
        res.status(200).send({
            type: 'ok',
            status: 200,
            standard: standard
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Estandar no encontrado'
        });
    };

};

const getStandardBySearch = async( req, res, next ) => {

    try { 
        let stdCode      = req.query.stdCode;   
        let stdOrgCode   = req.query.stdOrgCode;
        const stdBuCode  = req.query.stdBuCode; 
        const stdPurcCode= req.query.stdPurcCode;
        let stdYear      = req.query.stdYear;
        let stdVersion   = req.query.stdVersion;
        const stdUserId  = req.query.stdUserId;
        let stdPurchase  = req.query.stdPurchase;

        if (typeof stdCode == "undefined") {
            stdCode = null;
        }
        if (typeof stdOrgCode == "undefined") {
            stdOrgCode = null;
        }
        if (typeof stdYear == "undefined") {
            stdYear = null;
        }
        if (typeof stdVersion == "undefined") {
            stdVersion = null;
        }               
        if (typeof stdPurchase == "undefined") {
            stdPurchase = null;
        }                     
        
        const standards = await StandardModel.getStandardBySearch(stdCode, stdOrgCode, stdBuCode, stdPurcCode, stdYear, stdVersion, stdUserId,stdPurchase);
        
        if(standards.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: standards.message,
                standards: standards.standards
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: standards.status,
                mensaje: standards.message
            });
        };
    } catch (error) {
        next();
    };
};

const getStandardApplieToMajor = async( req, res, next ) => {

    try {
        const purcCode = req.query.purcCode;
        const buCode = req.query.buCode;
        const majorCode = req.query.majorCode;
        const stdCode = req.query.stdCode;
        const stdVersion = req.query.stdVersion;                

        const { searchTerm } = req.query;

        const standardsAppliedToMajor = await StandardModel.getStandardApplieToMajor( purcCode, buCode, majorCode, stdCode, stdVersion );
        if(standardsAppliedToMajor.type === 'ok'){

            let filteredStandardsAppliedToMajor = standardsAppliedToMajor.standardsAppliedToMajor;

            if (searchTerm) {
                if (searchTerm) {
                    filteredStandardsAppliedToMajor = filteredStandardsAppliedToMajor.filter(standard => 
                                                            standard.prgdMajorCode.toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.coursCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.coursDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdcItemCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.itemDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdcRlayCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.rlayDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
                } 
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: standardsAppliedToMajor.message,
                standardsAppliedToMajor: filteredStandardsAppliedToMajor
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: standardsAppliedToMajor.status,
                mensaje: standardsAppliedToMajor.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getStandardApplieToRoomLayout = async( req, res, next ) => {

    try {
        const purcCode = req.query.purcCode;
        const buCode = req.query.buCode;
        const rlayCode = req.query.rlayCode;
        const stdCode = req.query.stdCode;
        const stdVersion = req.query.stdVersion;                

        const { searchTerm } = req.query;

        const standardsAppliedToRoomLayout = await StandardModel.getStandardApplieToRoomLayout( purcCode, buCode, rlayCode, stdCode, stdVersion );
        if(standardsAppliedToRoomLayout.type === 'ok'){

            let filteredStandardsAppliedToRoomLayout = standardsAppliedToRoomLayout.standardsAppliedToRoomLayout;

            if (searchTerm) {
                if (searchTerm) {
                    filteredStandardsAppliedToRoomLayout = filteredStandardsAppliedToRoomLayout.filter(standard => 
                                                           (standard.coursCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.coursDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.itemCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.itemDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.rlayCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.rlayDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
                } 
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: standardsAppliedToRoomLayout.message,
                standardsAppliedToRoomLayout: filteredStandardsAppliedToRoomLayout
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: standardsAppliedToRoomLayout.status,
                mensaje: standardsAppliedToRoomLayout.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getStandardEquipmentByMajor = async( req, res, next ) => {

    try {
        //console.log();
        const purcCode = req.query.purcCode;
        const majorCode = req.query.majorCode;
        const progCode = req.query.progCode;  

        const { searchTerm } = req.query;

        const standardsEquipmentByMajor = await StandardModel.getStandardEquipmentByMajor( majorCode, progCode, purcCode);
        if(standardsEquipmentByMajor.type === 'ok'){

            let filteredStandardsEquipmentByMajor = standardsEquipmentByMajor.standardsEquipmentByMajor;

            if (searchTerm) {
                if (searchTerm) {
                    filteredStandardsEquipmentByMajor = filteredStandardsEquipmentByMajor.filter(standard => 
                                                           (standard.stdcPurcCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.coursDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdcItemCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdcItemDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdRlayCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (standard.stdcRlayDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
                } 
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: standardsEquipmentByMajor.message,
                standardsEquipmentByMajor: filteredStandardsEquipmentByMajor   
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: standardsEquipmentByMajor.status,
                mensaje: standardsEquipmentByMajor.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getBookCoverage = async( req, res, next ) => {

    try {
        const orgCode = req.query.orgCode;
        const majorCode = req.query.majorCode;
        const progCode = req.query.progCode;
        const cityCode = req.query.cityCode;
        const idStd = req.query.idStd;     
        const idDda = req.query.idDda;     
        const idStock = req.query.idStock;     
        
        const { searchTerm } = req.query;

        const booksCoverage = await StandardModel.getBookCoverage( orgCode, majorCode, progCode, cityCode, idStd, idDda, idStock );
        if(booksCoverage.type === 'ok'){

            let filteredBookCoverage = booksCoverage.bookCoverage;

            if (searchTerm) {
                if (searchTerm) {
                    filteredBookCoverage = filteredBookCoverage.filter(coverage => 
                                                            coverage.prgdMajorCode.toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (coverage.coursCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (coverage.coursDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (coverage.stdcItemCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (coverage.itemDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (coverage.stdcRlayCode).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
                                                        || (coverage.rlayDescription).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes((searchTerm).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
                } 
            };

            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: booksCoverage.message,
                booksCoverage: filteredBookCoverage
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: booksCoverage.status,
                mensaje: booksCoverage.message
            });
        };
    } catch (error) {
        next();
    };
    
};
const createStandard = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const {stdCode, stdOrgCode, stdBuCode, stdPurcCode, stdVersion} = req.body;
        const standardExist = await StandardModel.standardExists( stdCode, stdOrgCode, stdBuCode, stdPurcCode, stdVersion);
        
        if( standardExist.type === 'error' ){
            throw new HttpException(500, standardExist.message );
        };
        
        const result = await StandardModel.createStandard(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Estandar ha sido creado!'
        });
    } catch (error) {
        res.status(500).send({
            type: 'error',
            status: 500,
            message: error.message
        });
        next();
    };
};

const updateStandard = async( req, res, next ) =>{

    const homologa = {
        'stdOrgCode' :  'std_org_code',
        'stdCaccCode':  'std_cacc_code',        
        'stdSchoCode':  'std_scho_code',
        'stdName'    :  'std_name',        
        'stdYear'    :  'std_year',
        'stdStatus'  :  'std_status'
    };

    checkValidation(req);

    const {std_org_code, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await StandardModel.updateStandard(newRestOfUpdates[0], req.query.stdCode, req.query.stdPurcCode, req.query.stdVersion);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Estandar Actualizado con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Estandar no se pudo actualizar'
        });
    };

};


const deleteStandard = async (req, res, next) => {
    
    const stdCode       = req.query.stdCode;
    const stdOrgCode    = req.query.stdOrgCode;
    const stdBuCode     = req.query.stdBuCode;
    const stdPurcCode   = req.query.stdPurcCode;
    const stdVersion    = req.query.stdVersion;

    const result = await StandardModel.deleteStandard(stdCode,stdOrgCode,stdBuCode,stdPurcCode,stdVersion);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Estandar ha sido eliminado!'
    });
};

const enableDisableStandard = async (req, res, next) => {
    
    const stdCode       = req.body.params.stdCode;
    const stdOrgCode    = req.body.params.stdOrgCode;
    const stdBuCode     = req.body.params.stdBuCode;
    const stdPurcCode   = req.body.params.stdPurcCode;
    const stdVersion    = req.body.params.stdVersion;
    const stdStatus     = req.body.params.stdStatus;
    let result = null;
    if(stdStatus == 'S'){
        result = await StandardModel.enableDisableStandard(stdCode,stdOrgCode,stdBuCode,stdPurcCode,stdVersion,'N');
    } else {
        result = await StandardModel.enableDisableStandard(stdCode,stdOrgCode,stdBuCode,stdPurcCode,stdVersion,'S');
    }

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Estandar ha sido Actualizado!'
    });
};


checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllStandarsByUserId,
    getStandardById,
    getStandardBySearch,
    getStandardApplieToMajor,
    getStandardEquipmentByMajor,
    getStandardApplieToRoomLayout,
    getBookCoverage,
    createStandard,
    updateStandard,
    deleteStandard,
    enableDisableStandard
};