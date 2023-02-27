const express = require("express");
const bodyParser = require("body-parser");
const playerController = require("../controllers/playerController");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/Players/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage });
const playerRouter = express.Router();
playerRouter.use(bodyParser.json());
playerRouter
  .route("/")
  .get(playerController.index)
  .post(upload.single("file"), playerController.create);
playerRouter
  .route("/edit/:playerId")
  .get(playerController.formEdit)
  .post(upload.single("file"), playerController.edit);
playerRouter.route("/delete/:playerId").get(playerController.delete);
module.exports = playerRouter;
