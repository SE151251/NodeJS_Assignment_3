const express = require("express");
const nationRouter = express.Router();
const bodyParser = require("body-parser");
const nationController = require("../controllers/nationController");
const {ensureAuthenticated} = require('../config/auth')
const {requireRole} = require('../config/verifyRole')
nationRouter.use(bodyParser.json());
nationRouter
  .route("/")
  .get(nationController.index)
  .post(ensureAuthenticated,nationController.create);
nationRouter
  .route("/edit/:nationId")
  .get(ensureAuthenticated,requireRole, nationController.formEdit)
  .post(ensureAuthenticated,nationController.edit);
nationRouter.route("/delete/:nationId").get(nationController.delete);

module.exports = nationRouter;
