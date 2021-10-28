module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        content: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
    });

    return Comment;
};
