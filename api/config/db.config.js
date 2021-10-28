require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
module.exports = {
    HOST: DB_HOST,
    USER: DB_USER,
    PASSWORD: DB_PASSWORD,
    DB: DB_NAME,
    dialect: "mysql"
};
