const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
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
    const password = 'AdminPass123!';
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query("UPDATE users SET password_hash = ? WHERE role = 'admin'", [hash]);
    console.log('Updated rows:', result.affectedRows);
    console.log('New admin password:', password);
    await pool.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
