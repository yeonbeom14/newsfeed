const express = require("express");
const { Op } = require("sequelize");
const { Posts, Users, Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.put("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    const { comment } = req.body;
    const { userId } = res.locals.user;

    try {
        if (!req.body) {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
        }
        if (!comment) {
            return res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요." });
        }

        const existComments = await Comments.findOne({ where: { commentId } });
        const existComments2 = await Comments.findOne({ where: { postId } });

        if (existComments !== existComments2) {
            return res.status(404).json({ errorMessage: "댓글이 조회에 실패했습니다." });
        }

        if (!existComments) {
            return res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
        }

        if (existComments.userId !== userId) {
            return res.status(401).json({ errorMessage: "댓글 수정 권한이 없습니다." });
        }

        await Comments.update(
            { comment },
            {
                where:
                {
                    [Op.and]: [{ commentId }, { UserId: userId }],
                }
            }
        );
        return res.status(200).json({ errorMessage: "댓글을 수정하였습니다." });
    } catch (error) {
        return res.status(500).json({ error, errorMessage: "댓글을 수정에 실패하였습니다." });
    }
});

router.delete("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    const { userId } = res.locals.user;

    try {
        const existComments = await Comments.findOne({ where: { commentId } });
        const existComments2 = await Comments.findOne({ where: { postId } });

        if (existComments !== existComments2) {
            return res.status(404).json({ errorMessage: "댓글이 조회에 실패했습니다." });
        }

        if (!existComments) {
            return res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
        }
        if (existComments.userId !== userId) {
            return res.status(401).json({ errorMessage: "댓글 삭제 권한이 없습니다." });
        }

        await Comments.destroy({
            where: {
                [Op.and]: [{ commentId }, { UserId: userId }],
            },
        });


        return res.status(200).json({ errorMessage: "댓글을 삭제하였습니다." });
    } catch (error) {
        return res.status(500).json({ error, errorMessage: "댓글 삭제에 실패하였습니다." });
    }
}
);


module.exports = router;