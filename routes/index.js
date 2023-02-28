var express = require('express');
var router = express.Router();
const playerController = require("../controllers/playerController");
/* GET home page. */
router.get('/', playerController.home);

module.exports = router;
