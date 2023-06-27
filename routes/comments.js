const express = require("express");
const { Op } = require("sequelize");
const { Posts, Users, Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 댓글 생성 API
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { comment } = req.body;

    try {
        const post = await Posts.findOne({ where: { postId } });
        if (!post) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        }
        if (!req.body) {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
        }
        if (!comment) {
            return res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요." });
        }

        const { nickname } = await Users.findOne({ where: { userId } });
        const createdComment = await Comments.create({ UserId: userId, PostId: postId, Nickname: nickname, comment });

        res.status(201).json({ comment: createdComment, message: "댓글을 작성하였습니다." });
    } catch (err) {
        return res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
    }
});

// 댓글 목록 조회 API
router.get("/posts/:postId/comments", async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Posts.findOne({ where: { postId } });
        if (!post) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        }

        const commentList = await Comments.findAll({
            where: { PostId: postId },
            attributes: { exclude: ['PostId'] },
            order: [['createdAt', 'DESC']]
        });

        res.json({ data: commentList });
    } catch (err) {
        return res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다." });
    }
});

module.exports = router;