const express = require('express');
const bodyParser = require("body-parser");
const userController = require('../controllers/userController')
const playersController = require('../controllers/playerController');
const userRouter = express.Router();
const {ensureAuthenticated, jwtAuth} = require('../config/auth')
const {redirectLogin} = require('../config/redirectLogin')

userRouter.use(bodyParser.json())
userRouter.route('/')
 .get(userController.index)
 .post(userController.regist)
userRouter.route('/login')
 .get(userController.login)
 .post(userController.loginJWT)
 userRouter.route('/logout')
 .get(userController.logout)
 userRouter.route('/dashboard')
  .get(jwtAuth,playersController.dashboard)
  userRouter.route('/edit')
  .get(jwtAuth,userController.formEdit)
  .post(jwtAuth,userController.edit)
module.exports = userRouter;

