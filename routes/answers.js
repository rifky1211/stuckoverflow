var express = require('express');
var router = express.Router();
var models = require("../models/index");
var helpers = require("../helpers/util")
var jwt = require("jsonwebtoken")

/* GET home page. */
router.get("/:questionid", helpers.verifyToken, function (req, res, next) {
    models.Answer.findAll({
        where: {
            QuestionId: req.params.questionid
        }
    })
      .then((answers) => {
        res.json(answers);
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  });
router.post("/", helpers.verifyToken, (req, res, next) => {
    models.Answer.create({

      answer: req.body.answer,
      vote: {count: 0, voter: []},
      QuestionId: req.body.QuestionId
    })
      .then((answer) => {
        res.status(201).json(answer);
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  });


  router.put('/vote', helpers.verifyToken, (req, res) => {
    const {id, name} = jwt.decode(req.headers["x-access-token"])

    models.Answer.findOne({
      where: {
        id: req.body.idAnswer
      }
    }).then((answer) => {
      console.log(answer)
      if(answer.vote.voter.filter((item) => item.id == id).length == 0){
        answer.vote = {
          count: answer.vote.count + 1,
          voter: [...answer.vote.voter, {id, name}],
        }
        answer.save()
        res.json({
          success: true
        })
      }else{
        res.json({
          success: false,
          message: "anda sudah vote"
        })
      }
    })
  })

  router.put('/votedown/vote', helpers.verifyToken, (req, res) => {
    const {id, name} = jwt.decode(req.headers["x-access-token"])

    models.Answer.findOne({
      where: {
        id: req.body.idAnswer
      }
    }).then((answer) => {
      console.log(answer)
      if(answer.vote.voter.filter((item) => item.id == id).length == 0){
        answer.vote = {
          count: answer.vote.count - 1,
          voter: [...answer.vote.voter, {id, name}],
        }
        answer.save()
        res.json({
          success: true
        })
      }else{
        res.json({
          success: false,
          message: "anda sudah vote"
        })
      }
    })
  })
module.exports = router;
