var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


/* Empresas select option */
router.get('/api', function (req, res, next) {
    res.render('index', {title: 'HolaMundo'});
});

module.exports = router;
