const db = require("../db/queries");

async function showAllUploads(req, res, next) {
    try {
        if (!req.user) return res.redirect("/");
        const files = await db.fetchAllUploads(req.user.id);
        res.render("home", { user: req.user, files });
    } catch (err) {
        next(err);
    }
}

async function uploadFile(req, res, next) {
    console.log("Upload File Middleware Reached");
    try {
        if (!req.user) return res.redirect("/");
        const { originalname, buffer } = req.file;

        await db.insertFile(req.user.id, originalname, buffer);
        res.redirect("/home");
    } catch (err) {
        next(err);
    }
}

module.exports = { showAllUploads, uploadFile };