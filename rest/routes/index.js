var express = require('express');
var router = express.Router();
var authService = require('../services/auth')

/* GET home page. */
router.get('/', authService.introspectToken, function(req, res, next) {
  // console.log(req.data.data)
  res.send("hello")
});

router.get('/test', authService.validateJwt, function(req, res, next) {
  // console.log(req.data.data)
  res.send("hello")
});

module.exports = router;
