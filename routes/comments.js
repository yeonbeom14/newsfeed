const express = require("express");
const { Op } = require("sequelize");
const { Posts, Users, Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


module.exports = router;