const pool = require('./pool');

async function fetchAllUploads(userId) {
    const res = await pool.query("SELECT * FROM uploads WHERE user_id = $1", [userId]);
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

async function insertFile(userId, filename, filedata) {
    const res = await pool.query(
        "INSERT INTO uploads (user_id, filename, filedata) VALUES ($1, $2, $3)",
        [userId, filename, filedata]
    );
    return res;
}

module.exports = { 
    fetchAllUploads,
    insertPasswordAndUsername,
    checkUsernameExists,
    insertFile
};