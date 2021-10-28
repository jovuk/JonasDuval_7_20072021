module.exports = (sequelize, Sequelize) => {
    const Article = sequelize.define("article", {
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT,
            allowNull:false
        },
        image: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        likesCount: {
            type:Sequelize.INTEGER,
            defaultValue: 0
        },
    });

    return Article;
};

