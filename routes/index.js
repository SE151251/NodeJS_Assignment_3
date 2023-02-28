var express = require('express');
var router = express.Router();
const playerController = require("../controllers/playerController");
const User = require("../controllers/userController")
/* GET home page. */
router.get('/', playerController.home);
router.get('/accounts', User.listUsers);
module.exports = router;
