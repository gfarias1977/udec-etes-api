const express = require('express');
const router = express.Router();

const authController = require('../../mvc/v1/controller/auth.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { authLoginSchema } = require('../../middleware/validators/authValidator.middleware');
const { auth } = require('../../middleware/auth.middleware');

router.post('/', authLoginSchema, awaitHandlerFactory(authController.userLogin)); // localhost:3000/api/v1/auth
router.post('/me', auth, awaitHandlerFactory(authController.userMe)); // localhost:3000/api/v1/auth
router.post('/logout', auth, awaitHandlerFactory(authController.userLogout)); // localhost:3000/api/v1/auth

module.exports = router;