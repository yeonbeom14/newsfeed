'use strict';

const express = require("express");
const jwt = require("jsonwebtoken");
const { Users } = require("../../models");
const authMiddleware = require("../../middlewares/auth-middleware");
const router = express.Router();
const bcrypt = require("bcryptjs");

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
            return res.status(412).json({ errorMessage: "비밀번호 형식이 일치하지 않습니다." });
        }
        if (!nickname) {
            return res.status(412).json({ errorMessage: "닉네임 형식이 일치하지 않습니다." });
        }
        const isExistUser = await Users.findOne({ where: { email } });
        if (isExistUser) {
            return res.status(412).json({ errorMessage: "중복된 이메일입니다." });
        }

        //암호화
        const hashPassword = await bcrypt.hash(req.body.password, 5);
        const user = await Users.create({ email, password: hashPassword, nickname, description });
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
        if (!user) {
            return res.status(412).json({ errorMessage: "이메일 또는 비밀번호를 확인해주세요." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(412).json({ errorMessage: "이메일 또는 비밀번호를 확인해주세요." });
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

//로그아웃
router.get('/logout', (req, res) => {
    try {
        return res.clearCookie('Authorization').json({ message: "로그아웃 성공하였습니다." });
    } catch (err) {
        return res.status(400).json({ errorMessage: "로그아웃 실패하였습니다." });
    }
});

//프로필 조회 api
router.get("/profile", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    try {
        const profile = await Users.findOne({ where: { userId } });
        if (!profile) {
            return res.status(400).json({ errorMessage: "존재하지 않는 유저입니다." });
        }
        return res.json({ "profile": profile });

    } catch (err) {
        return res.status(400).json({ errorMessage: "프로필 조회에 실패하였습니다." });
    }
});

//프로필 수정 api
router.put("/profile", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { password, nickname, description, newPassword, newComfirm } = req.body;

    try {
        const user = await Users.findOne({ where: { userId } });
        if (!user) {
            return res.status(400).json({ errorMessage: "존재하지 않는 유저입니다." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." })
        }
        if (newPassword) {
            if (newPassword !== newComfirm) {
                return res.status(412).json({ errorMessage: "새로운 비밀번호가 일치하지 않습니다." })
            }
            const passwordReg = /^.{4,}$/; //password 형식 검사
            if (!passwordReg.test(newPassword)) {
                return res.status(412).json({ errorMessage: "비밀번호 형식이 일치하지 않습니다." });
            }
        }

        const hashPassword = (!newPassword) ? newPassword : await bcrypt.hash(newPassword, 5);

        let updateValues = {};
        if (hashPassword) updateValues.password = hashPassword;
        if (nickname) updateValues.nickname = nickname;
        if (description) updateValues.description = description;

        await Users.update(
            updateValues,
            {
                where: { UserId: userId }
            }

        );
        return res.status(200).json({ message: "프로필을 수정하였습니다." });
    } catch (err) {
        return res.status(400).json({ errorMessage: "프로필 수정에 실패하였습니다." });
    }
});

//프로필 삭제 api
router.delete("/profile", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { password } = req.body;
    try {
        const user = await Users.findOne({ where: { userId } });
        if (!user) {
            return res.status(400).json({ errorMessage: "존재하지 않는 유저입니다." });
        }
        if (!password) {
            return res.status(400).json({ errorMessage: "비밀번호 형식이 일치하지 않습니다." })
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." })
        }

        await Users.destroy({
            where: { UserId: userId }
        });

        return res.status(200).json({ message: "프로필을 삭제하였습니다." });
    } catch (err) {
        return res.status(400).json({ errorMessage: "프로필 삭제에 실패하였습니다." });
    }
});

module.exports = router;