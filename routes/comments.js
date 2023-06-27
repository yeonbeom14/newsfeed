const express = require("express");
const { Op } = require("sequelize");
const { Posts, Users, Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.put("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    const commentId = req.params.commentId;
    const { comment } = req.body;
    const { userId } = res.locals.user;

    try {
        if (!userId) return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." });
        if (!id) return res.status(400).json({ errorMessage: "데이터의 형식이 올바르지 않습니다." });
        if (!comment) return res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요." });

        const existComments = await Comments.findOne({ where: { commentId } });

        if (!existComments) return res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
        if (existComments.userId !== userId) return res.status(401).json({ errorMessage: "수정 권한이 없습니다." });

        await Comments.update(
            { comment },
            {
                where:
                {
                    [Op.and]: [{ userId }, { commentId }],
                }
            }
        );
        return res.status(200).json({ errorMessage: "댓글을 수정하였습니다." });
    } catch (error) {
        return res.status(500).json({ error, errorMessage: "서버오류" });
    }
});

router.delete("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    const commentId = req.params.commentId;
    const { userId } = res.locals.user;
    try {
        if (!userId) return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." });
        if (!commentId) return res.status(400).json({ errorMessage: "데이터의 형식이 올바르지 않습니다." });

        const existComments = await Comments.findOne({ where: { commentId } });

        if (!existComments) return res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다." });
        if (existComments.userId !== userId) return res.status(401).json({ errorMessage: "삭제 권한이 없습니다." });

        await Comments.remove(commentId, userId);

        return res.status(200).json({ errorMessage: "댓글을 삭제하였습니다." });
    } catch (error) {
        return res.status(500).json({ error, errorMessage: "서버오류" });
    }
}
)


module.exports = router;