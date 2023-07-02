'use strict';

const express = require("express");
const { Op } = require("sequelize");
const { Posts, Users } = require("../../models");
const authMiddleware = require("../../middlewares/auth-middleware");
const router = express.Router();

// 게시글 작성 API
router.post("/posts", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { category, title, content, url } = req.body;
    const likearr = []

    try {
        if (!req.body) {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
        }
        if (!category) {
            return res.status(412).json({ errorMessage: "게시글 카테고리의 형식이 일치하지 않습니다." });
        }
        if (!title) {
            return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
        }
        if (!content) {
            return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
        }
        if (!url) {
            return res.status(412).json({ errorMessage: "Url의 형식이 일치하지 않습니다." });
        }
        console.log(category, "2");
        const { nickname, description } = await Users.findOne({ where: { userId } });
        const createdPost = await Posts.create({ UserId: userId, Nickname: nickname, Description: description,category, title, content, url, like: JSON.stringify(likearr) });
        res.status(201).json({ post: createdPost, message: "게시글 작성에 성공하였습니다." });

    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
    }
});

// 게시글 전체 조회 API
router.get("/posts", async (req, res) => {
    try {
        const posts = await Posts.findAll({
            attributes: { exclude: ['content'] },
            order: [['createdAt', 'DESC']]
        });

        return res.json({ "posts": posts });
    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

// 게시글 카테고리 조회 API
router.get("/category/:categoryName", async (req, res) => {
    const { categoryName } = req.params;
    try {
        console.log(categoryName, "11");
        const category = await Posts.findAll({
            where: { category: categoryName },
            //attributes: ['postId','Nickname','Description','category','title','url','createdAt'],
            attributes: { exclude: ['content'] },
            order: [['createdAt', 'DESC']]
        });
        console.log(categoryName, "12");
        return res.json({ "category": category });
    } catch (err) {
        console.log(categoryName, "3");
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

// 게시글 상세 조회 API
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Posts.findOne({ where: { postId } });
        if (!post) {
            return res.status(400).json({ errorMessage: "게시글이 존재하지 않습니다." });
        }
        return res.json({ "post": post });

    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

//게시글 수정 API
router.put("/posts/:postId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { title, content, url } = req.body;

    try {
        const updatedPost = await Posts.findOne({ where: { postId } });
        if (!updatedPost) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        }
        if (!req.body) {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
        }
        if (!title) {
            return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
        }
        if (!content) {
            return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
        }
        if (!url) {
            return res.status(412).json({ errorMessage: "Url의 형식이 일치하지 않습니다." });
        }
        if (userId !== updatedPost.UserId) {
            return res.status(403).json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
        }

        await Posts.update(
            { title, content, url },
            {
                where: {
                    [Op.and]: [{ postId }, { UserId: userId }],
                }
            }
        );
        return res.status(200).json({ message: "게시글을 수정하였습니다." });
    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 수정에 실패하였습니다." });
    }
});

//게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;

    try {
        const deletedPost = await Posts.findOne({ where: { postId } });
        if (!deletedPost) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        }
        if (userId !== deletedPost.UserId) {
            return res.status(403).json({ errorMessage: "게시글의 삭제 권한이 존재하지 않습니다." });
        }

        await Posts.destroy({
            where: {
                [Op.and]: [{ postId }, { UserId: userId }],
            }
        });

        return res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } catch (err) {
        return res.status(400).json({ errorMessage: "게시글 삭제에 실패하였습니다." });
    }
});

//좋아요 PUT
router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    try {
        const updatedPost = await Posts.findOne({ where: { postId } });
        let likes = JSON.parse(updatedPost.like)
        const index = likes.indexOf(userId)
        if (!updatedPost) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        }
        if (index !== -1) {
            likes.splice(index, 1);
            let like = JSON.stringify(likes);
            await Posts.update(
                { like },
                {
                    where: { PostId: postId }
                });
            const post = await Posts.findOne({ where: { postId } });
            return res.json({ "post": post })
        }
        if (index == -1) {
            likes.push(userId)
        }
        if (likes) {
            let like = JSON.stringify(likes)

            await Posts.update(
                { like },
                {
                    where: { PostId: postId }
                })
            const post = await Posts.findOne({ where: { postId } });
            return res.json({ "post": post })
        }

    } catch (err) {
        return res.status(400).json({ errorMessage: "좋아요에 실패하였습니다." });
    }
});



module.exports = router;