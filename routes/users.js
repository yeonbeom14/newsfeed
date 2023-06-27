const express = require("express");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const router = express.Router();

// 회원가입 API
router.post("/signup", async (req, res) => {
    const { email, password, confirm, nickname, description } = req.body;

    const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    //이메일 형식검사
    const passwordReg = /^.{4,}$/; //password 형식 검사

    try {
        if (!emailReg.test(email)) {
            return res.status(412).json({ errorMessage: "이메일 형식이 일치하지 않습니다." });
        }
        if (password !== confirm) {
            return res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });
        }
        if (!passwordReg.test(password)) {
            return res.status(412).json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
        }
        if (!nickname) {
            return res.status(412).json({ errorMessage: "닉네임 형식이 일치하지 않습니다." });
        }
        const isExistUser = await Users.findOne({ where: { email } });
        if (isExistUser) {
            return res.status(412).json({ errorMessage: "중복된 이메일입니다." });
        }

        const user = await Users.create({ email, password, nickname, description });

        return res.status(201).json({ message: "회원 가입에 성공하였습니다." });

    } catch (err) {
        return res.status(400).json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
    }
});

// 로그인 API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ where: { email } });

        if (!user || password !== user.password) {
            res.status(412).json({
                errorMessage: "이메일 또는 패스워드를 확인해주세요.",
            });
            return;
        }

        const token = jwt.sign(
            { userId: user.userId },
            "custom-secret-key",
        );
        res.cookie("Authorization", `Bearer ${token}`);
        res.status(200).json({ token });

    } catch (err) {
        return res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
    }
});

module.exports = router;