module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        username: {
            type: Sequelize.STRING,
            allowNull:false,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull:false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        image: {
            type: Sequelize.STRING,
            defaultValue: false
        },
        deletedAt: {
            type: Sequelize.DATE,
            defaultValue: null
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        }
    });

    return User;
};

