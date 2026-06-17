const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
(async () => {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
    });
    const [rows] = await pool.query(
      "SELECT user_id, name, email, role, status, email_verified, password_hash FROM users WHERE role IN ('admin','Admin','ADMIN')"
    );
    console.log(JSON.stringify(rows, null, 2));
    await pool.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
