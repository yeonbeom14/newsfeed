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
router.get("/postdetail/:postId", (req, res) => {
    res.render("home/postdetail");
})
router.get("/modifypost/:postId", (req, res) => {
    res.render("home/modifypost");
})
router.get("/profile", (req, res) => {
    res.render("home/profile");
})
router.get("/modifyprofile", (req, res) => {
    res.render("home/modifyprofile");
})

module.exports = router;