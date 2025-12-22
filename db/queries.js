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

async function insertFile(userId, filename, filedata, mimetype) {
    const res = await pool.query(
        "INSERT INTO uploads (user_id, filename, filedata, mimetype) VALUES ($1, $2, $3, $4)",
        [userId, filename, filedata, mimetype]
    );
    return res;
}

async function getFile(fileId, userId) {
    const res = await pool.query(
        "SELECT * FROM uploads WHERE id = $1 AND user_id = $2",
        [fileId, userId]
    );
    return res.rows[0];
}

async function deleteFileById(fileId, userId) {
    const res = await pool.query(
        "DELETE FROM uploads WHERE id = $1 AND user_id = $2",
        [fileId, userId]
    );
    return res;
}

module.exports = { 
    fetchAllUploads,
    insertPasswordAndUsername,
    checkUsernameExists,
    insertFile,
    getFile,
    deleteFileById
};