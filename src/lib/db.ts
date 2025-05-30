import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
  host: 'localhost',         // or your server IP
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name',
});
