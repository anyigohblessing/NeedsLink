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
    const [rows] = await pool.query("SELECT password_hash FROM users WHERE email = 'admin@needslink.cm'");
    if (!rows.length) {
      console.error('Admin user not found');
      process.exit(1);
    }
    const ok = await bcrypt.compare('AdminPass123!', rows[0].password_hash);
    console.log('Password compare result:', ok);
    await pool.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
