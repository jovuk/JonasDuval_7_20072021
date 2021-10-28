const db = require("../models/index");
require('dotenv').config();
const fs = require('fs');
const Article = db.articles;
const Comment = db.comments;
const User = db.users;
const Like = db.userArticleLike;

exports.createArticle = (req, res) => {
    Article.create({
        title: req.body.title,
        content: req.body.content,
        image: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : '',
        date: req.body.date,
        isActive: req.body.isActive,
        userId: req.body.userId,
        comments: req.body.comments,
        likesCount: req.body.likesCount
    })
        .then((article) => {
            res.send(article)
        })
        .catch(() => {
            res.status(400).send({err: "Some error occurred while creating the Article."});
        });
}

exports.findArticleById = (req, res) => {
    Article.findOne({where: {id: req.params.id}}, { include: ["comments"] })
        .then(article => {
            res.send(article)
        })
        .catch((err) => {
            res.status(500).send({err})
        });
};

exports.getAllArticles = (req, res) => {
    Article.findAll({
        include: ["comments"],
        order: [
            ['date', 'DESC']
        ],
    })
        .then((articles) => {res.send(articles)})
        .catch((err) => {
            res.status(500).send({err})
        });
};

exports.getAllArticlesByUser = (req, res, next) => {
    Article.findAll({
        where: { UserId: req.body.userId},
        include: {
            model: User,
            attributes: ["id", "username", "isAdmin", "image"]
        },
        order: [
            ['date', 'DESC']
        ],
    })
        .then(articles => res.status(200).json(articles))
        .catch(error => res.status(500).json({ error }))
}

exports.deleteArticle = (req, res) => {
    Article.findOne({where: {id: req.params.id}})
        .then(article => {
            if (article.image) {
                const filename = article.image.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    article.destroy({where: {id: req.params.id}})
                        .then(() => res.status(200).json({message: 'Article is deleted !'}))
                        .catch(() => res.status(400).json({error: 'Some error occurred while deleting article.'}));
                });
            }
        })
        .catch(error => res.status(500).json({error: "Some error occurred while searching the Article"}));
}

exports.getAllComments = (req, res) => {
    Comment.findAll({where: { articleId: req.params.id}})
        .then(comments => res.status(200).json(comments))
        .catch(error => res.status(500).json({ error }))
}

exports.updateArticle = (req, res) => {
    Article.findOne({where: {id: req.params.id}})
        .then(article => {
            if (article.image) {
                const filename = article.image.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    article.update({
                        title: req.body.title,
                        content: req.body.content,
                        image: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : ''
                    })
                .then((article) => {
                        res.send(article)
                    })
                        .catch(() => {
                            res.status(400).send({err: "Some error occurred while updating the Article."});
                        });
                });
            }
        })
        .catch(error => res.status(500).json({error: "Some error occurred while searching the Article"}));
}

exports.createComment = (req, res) => {
    Article.findOne({ id: req.params.id })
        .then(article => {
            if (!article) {
                return res.status(404).json({ error: 'Unreachable article' })
            }
            Comment.create({
                content: req.body.content,
                articleId: req.body.articleId,
                date: req.body.date,
                userId: req.body.userId
            })
                .then(comment => res.status(201).json({ comment }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error}))
}

exports.deleteComment = (req, res) => {
    Comment.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: 'Commentaire supprimé'}))
        .catch(() => res.status(400).json({ error: 'Pb suppression commentaire' }));
};

exports.likeArticle = (req, res, next) => {
    Article.findOne({ where: {id: req.params.id } })
        .then(article => {
            if (!article) {
                return res.status(404).json({ error: 'Unreachable article !' })
            }
            Like.create({
                articleId: req.params.id,
                userId: req.body.userId,
                like: req.body.like
            })
                .then(() => {
                    let total = article.likesCount + 1;
                    article.update({ likesCount: total })
                        .then(() => {res.status(201).json({ message: 'Article liked', total })})
                        .catch(() => res.status(500).json({ error: ' Error update article' }))
                })
                .catch(error => res.status(400).json({ error }))

        })
        .catch(() => res.status(400).json({ message: "Error finding the article" }))
}

exports.getAllLikeArticle = (req, res, next) => {
    Like.findAll({
        where: { articleId: req.params.id},
        order: [
            ['date', 'DESC']
        ],
        include: {
            model: User,
            attributes: ["username"]
        },
    })
        .then(article => res.status(200).json(article))
        .catch(error => res.status(500).json({ error }))
}
