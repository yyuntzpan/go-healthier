import mysql from "mysql2";
let cachedConection = null;

async function getConnection() {
  if (cachedConection) {
    return cachedConection;
  }

  cachedConection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: a3000,
  });

  return cachedConection;
}
export default getConnection;
