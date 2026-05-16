const express = require('express');
const router = express.Router();

const userController = require('../../mvc/v1/controller/users.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {auth} = require('../../middleware/auth.middleware');
const { createUserSchema, deleteUserSchema, updateUserSchema } = require('../../middleware/validators/userValidator.middleware');

router.get('/', auth, awaitHandlerFactory(userController.getUsers)); // localhost:3000/api/v1/auth/create
router.post('/', auth, createUserSchema, awaitHandlerFactory(userController.createUser)); // localhost:3000/api/v1/auth/create
router.get('/:userId', auth, createUserSchema, awaitHandlerFactory(userController.getUserByID)); // localhost:3000/api/v1/auth/create
router.patch('/:userId', auth, updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:3000/api/v1/auth/create
router.delete('/:userId', auth, deleteUserSchema, awaitHandlerFactory(userController.deleteUser)); // localhost:3000/api/v1/auth/create

module.exports = router;