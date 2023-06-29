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
router.get("/post", (req, res) => {
    res.render("home/post");
})
router.get("/profile", (req, res) => {
    res.render("home/profile");
})
router.get("/modifyProfile", (req, res) => {
    res.render("home/modifyProfile");
})

module.exports = router;