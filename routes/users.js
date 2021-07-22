var express = require("express");
var router = express.Router();
var models = require("../models/index");
var jwt = require("jsonwebtoken");
const secretKey = "stuckoverflow";
const helpers = require("../helpers/util")

/* GET users listing. */
router.get("/", (req, res) => {
  models.User.findAll({
    where: {
      email: req.body.email
    }
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});
router.post("/", function (req, res, next) {
  models.User.create(req.body)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});
router.post("/authenticate", function (req, res) {
  // find the user
  models.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(function (user) {
        

      if (!user)
        return res.json({
          success: false,
          message: "Authentication failed. User not found.",
        });
      user.validatePassword(req.body.password, function (err, match) {
        if (err || !match)
          return res.json({
            success: false,
            message: "Authentication failed. User not found.",
          });
        var token = jwt.sign(
          {
            id: user.id,
            name: user.fullname,
          },
          secretKey,
          {
            expiresIn: 60 * 60,
          }
        );

        // return the information including token as JSON
        res.json({
          success: true,
          message: "Enjoy your token!",
          token: token,
        });
      });
    })
    .catch((err) => {
       res.json({
        success: false,
        message: "Authentication failed. User not found.",
      });
  })
});

module.exports = router;
