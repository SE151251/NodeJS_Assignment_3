const express = require("express");
const nationRouter = express.Router();
const bodyParser = require("body-parser");
const nationController = require("../controllers/nationController");
const {ensureAuthenticated} = require('../config/auth')
nationRouter.use(bodyParser.json());
nationRouter
  .route("/")
  .get(nationController.index)
  .post(ensureAuthenticated,nationController.create);
nationRouter
  .route("/edit/:nationId")
  .get(ensureAuthenticated,nationController.formEdit)
  .post(ensureAuthenticated,nationController.edit);
nationRouter.route("/delete/:nationId").get(nationController.delete);

module.exports = nationRouter;
