const pool = require('./pool');

async function fetchAllUploads() {
    const res = await pool.query("SELECT * FROM uploads");
    return res.rows;
}

async function insertPasswordAndUsername(username, hashedPassword) {
    const res = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, hashedPassword]
    );
    return res;
}

async function checkUsernameExists(username) {
    const res = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    return res.rows.length > 0;
}

module.exports = { 
    fetchAllUploads,
    insertPasswordAndUsername,
    checkUsernameExists
};