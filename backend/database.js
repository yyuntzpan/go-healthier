const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
    if (err) {
        console.error("❌ MySQL 連接失敗:", err);
        return;
    }
    console.log("✅ MySQL 連接成功!");
});

module.exports = connection;
