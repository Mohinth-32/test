import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
  port: process.env.DB_PORT
});

pool.getConnection()
.then(() => console.log("Database connected successfully"))
.catch(err => console.error("Database connection failed:", err));

export default pool;