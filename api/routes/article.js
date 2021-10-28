module.exports = app => {
    const articles = require("../controllers/article.js");

    const auth = require('../middleware/auth');
    const router = require("express").Router();
    const multerConfig = require('../middleware/multer-config')

    router.post("/", auth, multerConfig, articles.createArticle);
    router.put("/:id", auth, multerConfig, articles.updateArticle);
    router.get("/:id", auth, articles.findArticleById);
    router.get("/", auth, articles.getAllArticles);
    router.get("/users/:id", auth, articles.getAllArticlesByUser);
    router.delete('/:id', auth, articles.deleteArticle);

    router.post('/:id/likes', auth, articles.likeArticle);
    router.get('/:id/likes', auth, articles.getAllLikeArticle)

    router.get("/:id/comments", auth, articles.getAllComments);
    router.post("/:articleId/comments", auth, articles.createComment);
    router.delete("/:articleId/comments/:commentId",auth, articles.deleteComment);

    app.use('/api/articles', router);
};
