var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/question-detail/:id', function(req, res, next) {
  res.render('../public/question');
});

module.exports = router;
