module.exports = app => {
    const users = require("../controllers/user.js");
    const multer = require('../middleware/multer-config');
    const auth = require('../middleware/auth');
    const router = require("express").Router();

    router.post("/auth/login", users.login);
    router.post("/auth/signup", multer, users.signup);
    router.get("/:id", users.getOneUser);
    router.delete("/:id", users.deleteUser);

    app.use('/api/users', router);
};

