const express = require('express');
const bodyParser = require("body-parser");
const userController = require('../controllers/userController')
const userRouter = express.Router();
const {ensureAuthenticated} = require('../config/auth')
const {requireRole} = require('../config/verifyRole')

userRouter.use(bodyParser.json())
userRouter.route('/')
 .get(userController.index)
 .post(userController.regist)
userRouter.route('/login')
 .get(userController.login)
 .post(userController.signin)
 userRouter.route('/logout')
 .get(userController.signout)
 userRouter.route('/dashboard')
  .get(ensureAuthenticated,userController.dashboard)
  userRouter.route('/edit/:userId')
  .get(ensureAuthenticated,userController.formEdit)
  .post(ensureAuthenticated,userController.edit)
module.exports = userRouter;

