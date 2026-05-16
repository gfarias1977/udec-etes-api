const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HttpException = require('../../../utils/HttpException.utils');
const MajorOfferModel = require('../model/majorOffer.model');

const getAllMajorOffers = async( req, res, next ) => {

    try {
        const majorOffers = await MajorOfferModel.getAllMajorOffers();

        if(majorOffers.type === 'ok'){
            res.status(200).send( {
                type: 'ok',
                status: 200,
                message: majorOffers.message,
                majorOffers: majorOffers.majorOffers
            });
        }else{
            res.status(401).send( {
                type: 'error',
                status: majorOffers.status,
                mensaje: majorOffers.message
            });
        };
    } catch (error) {
        next();
    };
    
};

const getMajorOfferById = async( req, res, next ) => {

    const maofCampCode = req.query.maofCampCode;
    const maofAcademicYear = req.query.maofAcademicYear;
    const maofMajorCode = req.query.maofMajorCode;
    const maofPlanCode = req.query.maofPlanCode;
    const maofWktCode = req.query.maofWktCode;


    const majorOffer = await MajorOfferModel.getMajorOfferById( maofCampCode,maofAcademicYear,maofMajorCode,maofPlanCode,maofWktCode );
    
    if(majorOffer){
        res.status(200).send({
            type: 'ok',
            status: 200,
            majorOffer: majorOffer
        })
    }else{
        res.status(404).send({
            type: 'ok',
            status: 404,
            mensaje: 'Carrera Oferta no encontrada'
        });
    };

};


const createMajorOffer = async (req, res, next) => {
    checkValidation(req);

    try {
        
        const maofCampCode = req.body.maofCampCode;
        const maofAcademicYear = req.body.maofAcademicYear;
        const maofMajorCode = req.body.maofMajorCode;
        const maofPlanCode = req.body.maofPlanCode;
        const maofWktCode = req.body.maofWktCode;

        const majorOfferExist = await MajorOfferModel.majorOfferExist( maofCampCode,maofAcademicYear,maofMajorCode,maofPlanCode,maofWktCode );
        
        if( majorOfferExist.type === 'error' ){
            throw new HttpException(500, majorOfferExist.message );
        };
        
        const result = await MajorOfferModel.createMajorOffer(req.body);
        
        if (!result || result.type === 'error') {
            throw new HttpException(500, 'Error interno del servidor');
        };
        
        res.status(201).send({
            type: 'ok',
            status: 201,
            message: 'Carrera Oferta ha sido creada!'
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

const updateMajorOffer = async( req, res, next ) =>{

    const homologa = {
        'maofMin'             :'maof_min',
        'maofOffer'           :'maof_offer',
        'maofOfferType'       :'maof_offer_type'
    };

    checkValidation(req);

    const {maof_min, ...restOfUpdates } = req.body;

    let replaceKeyInObjectArray = (a, r) => a.map(o => 
        Object.keys(o).map((key) => ({ [r[key] || key] : o[key] })
    ).reduce((a, b) => Object.assign({}, a, b)));

    const newRestOfUpdates = replaceKeyInObjectArray([restOfUpdates], homologa);

    const result = await MajorOfferModel.updateMajorOffer(newRestOfUpdates[0], req.query.maofCampCode,req.query.maofAcademicYear,req.query.maofMajorCode,req.query.maofPlanCode,req.query.maofWktCode);
    
    if(result > 0){
        res.status(200).send({
            type: 'ok',
            status: 200,
            message: 'Carrera Oferta Actualizada con éxito'
        });
    }else{
        res.status(404).send({
            type: 'error',
            status: 404,
            message: 'Carrera Oferta no se pudo actualizar'
        });
    };

};

const deleteMajorOffer = async (req, res, next) => {
    
    const maofCampCode = req.query.maofCampCode;
    const maofAcademicYear = req.query.maofAcademicYear;
    const maofMajorCode = req.query.maofMajorCode;
    const maofPlanCode = req.query.maofPlanCode;
    const maofWktCode = req.query.maofWktCode;

    const result = await MajorOfferModel.deleteMajorOffer(maofCampCode,maofAcademicYear,maofMajorCode,maofPlanCode,maofWktCode);

    if (!result) {
        throw new HttpException(500, 'Error interno del servidor');
    };

    res.status(200).send({
        type: 'ok',
        status: 201,
        message: 'Carrera Oferta ha sido eliminada!'
    });
};

checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validación fallida', errors);
    }
};

module.exports = {
    getAllMajorOffers,
    getMajorOfferById,
    createMajorOffer,
    updateMajorOffer,
    deleteMajorOffer
};