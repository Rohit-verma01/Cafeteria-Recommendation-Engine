import * as mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'Cafeteria_Recommendation_System',
    waitForConnections: true
});

export default pool;