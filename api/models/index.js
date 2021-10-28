const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.articles = require("../models/Article.js")(sequelize, Sequelize);
db.comments = require("../models/Comment.js")(sequelize, Sequelize);
db.users = require("../models/User.js")(sequelize, Sequelize);
db.userArticleLike = require("../models/UserArticleLike.js")(sequelize, Sequelize);

db.articles.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.articles, { foreignKey: 'articleId'});

db.users.hasMany(db.comments, { as: "comments"});
db.comments.belongsTo(db.users, { foreignKey: 'userId'});

db.users.hasMany(db.articles, { as: "articles" });
db.articles.belongsTo(db.users, { foreignKey: 'userId'});

db.userArticleLike.belongsTo(db.articles, { foreignKey: 'articleId', onDelete: 'CASCADE' });
db.articles.hasMany(db.userArticleLike);
db.userArticleLike.belongsTo(db.users, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.users.hasMany(db.userArticleLike);


module.exports = db;
