'use strict';

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home/index");
})
router.get("/login", (req, res) => {
    res.render("home/login");
})
router.get("/signup", (req, res) => {
    res.render("home/signup");
})

module.exports = router;