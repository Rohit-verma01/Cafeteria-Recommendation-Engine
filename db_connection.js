"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql2/promise");
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'Cafeteria_Recommendation_System',
    waitForConnections: true
});
exports.default = pool;
