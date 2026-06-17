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
    const [schema] = await pool.query("SHOW CREATE TABLE users");
    console.log('SHOW CREATE TABLE users:');
    console.log(schema[0]['Create Table']);
    const [rows] = await pool.query("SELECT user_id, email, role, status, CHAR_LENGTH(password_hash) AS hash_len, password_hash FROM users WHERE role='admin'");
    console.log('Admin rows:');
    rows.forEach(r => console.log(JSON.stringify(r, null, 2)));
    await pool.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
