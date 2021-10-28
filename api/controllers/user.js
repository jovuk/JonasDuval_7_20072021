const db = require("../models/index");
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = db.users;

exports.signup = (req, res) => {
    const regexPassword = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
    if (!regexPassword.test(req.body.password)){
        res.status(406).json({ message: 'Mot de passe incorrect' })
        return false
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            User.create ({
                username: req.body.username,
                email: req.body.email,
                password: hash,
                isAdmin: req.body.isAdmin,
                image: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : '',
                deletedAt: req.body.deletedAt
            })
                .then(user => {
                    res.status(201).json({
                        id: user.id,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        image: user.image,
                        username: user.username,
                        token: jwt.sign(
                            {
                                id: user.id,
                            },
                            process.env.JWT_RAND_SECRET,
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))
};

exports.login = (req, res) => {
    User.findOne({where: { username: req.body.username }})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'Email/Mot de passe invalid !'});
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        image: user.image,
                        isAdmin: user.isAdmin,
                        deletedAt: user.deletedAt,
                        token: jwt.sign(
                            { id: user.id},
                            process.env.JWT_RAND_SECRET,
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error: 'la'}));
        })
        .catch(error => res.status(500).json({ error: 'ici' }));
};

exports.getAllUsers = (req, res) => {
    User.findAll({
        order: [
            ['username', 'ASC']
        ],
    })
        .then(users => res.status(200).json(users))
        .catch(error => res.status(500).json({ error }))
}

exports.getOneUser = (req, res, next) => {
    User.findOne({ where: { id: req.params.id }})
        .then(user => {res.status(200).json(user)})
        .catch(error => res.status(500).json( error ))
}

exports.deleteUser = (req, res, next) => {
    User.findOne({ where: { id: req.params.id }})
        .then(user => {
            if(user.image) {
                const filename = user.image.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    user.destroy({ where: { id: req.params.id } })
                        .then(() => res.status(200).json({ message: 'Compte supprimé'}))
                        .catch(() => res.status(400).json({ error: 'Probleme de suppression de compte' }));
                });
            }
        })
        .catch(() => res.status(500).json({ error:"probleme de base de données" }));
}
