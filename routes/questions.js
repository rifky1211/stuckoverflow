var express = require("express");
var router = express.Router();
var helpers = require("../helpers/util")
var models = require("../models/index");

/* GET home page. */
router.get("/", helpers.verifyToken, function (req, res, next) {
  models.Question.findAll({})
    .then((questions) => {
      res.json(questions);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});
// router.get("/search", function (req, res, next) {
//   models.Question.findOne({
//     where: {
//       title: req.body.title
//     }
//   })
//     .then((question) => {
//       res.json(question);
//     })
//     .catch((err) => {
//       res.status(500).json({ err });
//     });
// });
router.get('/:id', helpers.verifyToken, (req, res) => {
  models.Question.findAll({
    where: {
      id: req.params.id
    }
  }).then((question) => {
    res.json(question)
  }).catch(err => res.status(500).json({err}))
})

router.post("/", helpers.verifyToken, (req, res, next) => {
  models.Question.create({
    title: req.body.title,
    description: req.body.description,
    tag: {},
    vote: {},
  })
    .then((question) => {
      res.status(201).json(question);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.delete("/:id", (req, res) => {
  models.Question.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((question) => {
      res.status(201).json(question);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

module.exports = router;
