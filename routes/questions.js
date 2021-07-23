var express = require("express");
var router = express.Router();
var helpers = require("../helpers/util")
var models = require("../models/index");
var jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");

/* GET home page. */
router.get("/", helpers.verifyToken, function (req, res, next) {
  models.Question.findAll({
    order: [
      ['id', 'DESC'],
  ],
  include: [models.Answer]
  })
    .then((questions) => {
      res.json(questions);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});
router.get("/search/question", async function (req, res, next) {
  try {
    const answers = await models.sequelize.query(
      `SELECT * FROM "Questions" where "title" ilike '%${req.query.title}%' or "tag" ilike '%${req.query.title}%'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json(answers);
  } catch (err) {
    console.log(err);
  }
});
router.get('/:id', helpers.verifyToken, (req, res) => {
  models.Question.findAll({
    where: {
      id: req.params.id
    },
    include: [models.Answer]
  }).then((question) => {
    res.json(question)
  }).catch(err => res.status(500).json({err}))
})

router.post("/", helpers.verifyToken, (req, res, next) => {
  const manyTags= {}
  const tags = req.body.tags
  const splitTag = tags.split(",")
  
  
  console.log(tags)
  models.Question.create({
    title: req.body.title,
    description: req.body.description,
    tag: tags,
    vote: { count: 0, voter: [] },
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

router.put("/vote/question", helpers.verifyToken, (req, res) => {
  const { id, name } = jwt.decode(req.headers["x-access-token"]);

  models.Question.findOne({
    where: {
      id: req.body.idQuestion,
    },
  }).then((question) => {
    if (req.body.isVote == "up") {
      if (question.vote.voter.filter((item) => item.id == id).length == 0) {
        question.vote = {
          count: question.vote.count + 1,
          voter: [...question.vote.voter, { id, name }],
        };
        question.save();
        res.json({
          success: true,
        });
      } else {
        res.json({
          success: false,
          message: "anda sudah vote",
        });
      }
    }else{
      if (question.vote.voter.filter((item) => item.id == id).length == 0) {
        question.vote = {
          count: question.vote.count - 1,
          voter: [...question.vote.voter, { id, name }],
        };
        question.save();
        res.json({
          success: true,
        });
      } else {
        res.json({
          success: false,
          message: "anda sudah vote",
        });
      }
    }
  });
});
module.exports = router;
