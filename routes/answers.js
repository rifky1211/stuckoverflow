var express = require("express");
var router = express.Router();
var models = require("../models/index");
var helpers = require("../helpers/util");
var jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");
/* GET home page. */
router.get(
  "/:questionid",
  helpers.verifyToken,
  async function (req, res, next) {
    try {
      const answers = await models.sequelize.query(
        `SELECT * FROM "Answers" where "QuestionId" = ${req.params.questionid} order by (vote ->> 'count')::int desc`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json(answers);
    } catch (err) {
      console.log(err);
    }
  }
);
router.post("/", helpers.verifyToken, (req, res, next) => {
  models.Answer.create({
    answer: req.body.answer,
    vote: { count: 0, voter: [] },
    QuestionId: req.body.QuestionId,
  })
    .then((answer) => {
      res.status(201).json(answer);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.put("/vote/answer", helpers.verifyToken, (req, res) => {
  const { id, name } = jwt.decode(req.headers["x-access-token"]);

  models.Answer.findOne({
    where: {
      id: req.body.idAnswer,
    },
  }).then((answer) => {
    if (req.body.isVote == "up") {
      if (answer.vote.voter.filter((item) => item.id == id).length == 0) {
        answer.vote = {
          count: answer.vote.count + 1,
          voter: [...answer.vote.voter, { id, name }],
        };
        answer.save();
        res.json({
          success: true,
        });
      } else {
        res.json({
          success: false,
          message: "anda sudah vote",
        });
      }
    } else {
      if (answer.vote.voter.filter((item) => item.id == id).length == 0) {
        answer.vote = {
          count: answer.vote.count - 1,
          voter: [...answer.vote.voter, { id, name }],
        };
        answer.save();
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
