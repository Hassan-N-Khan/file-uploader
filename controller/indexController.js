const db = require("../db/queries");

async function showAllUploads(req, res) {
    const uploads = await db.fetchAllUploads();
    res.render("index", {uploads});
}

module.exports = { showAllUploads };