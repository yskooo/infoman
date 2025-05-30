// Re-export all API services from the new modular structure
// This maintains backward compatibility with existing code

export * from './api';

import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';

config();

const pool = createPool({
    host: '127.0.0.1',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'stockacc_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
