module.exports = (sequelize, Sequelize) => {
    const UserArticleLike = sequelize.define("userArticleLike", {
        like: {
            type: Sequelize.INTEGER,
        },
    });

    return UserArticleLike;
};

