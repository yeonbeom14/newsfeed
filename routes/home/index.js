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
router.get("/editpost/:postId", (req, res) => {
    res.render("home/editpost");
})
router.get("/profile", (req, res) => {
    res.render("home/profile");
})
router.get("/editprofile", (req, res) => {
    res.render("home/editprofile");
})

module.exports = router;