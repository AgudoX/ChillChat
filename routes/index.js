var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  //Coje la view index.js y la envía al HTML de la aplicaciónd de node.
  res.render('index', { title: 'Express' });
});

module.exports = router;
