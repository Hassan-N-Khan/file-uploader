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

        await db.insertFile(req.user.id, originalname, buffer, req.file.mimetype);
        res.redirect("/home");
    } catch (err) {
        next(err);
    }
}

async function viewFile(req, res, next) {
    console.log("Download File controller Reached");
    try {
        if (!req.user) return res.redirect("/");
        const fileId = req.params.id;
        const file = await db.getFile(fileId, req.user.id);
        if (!file) {
            return res.status(404).send("File not found");
        }
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${file.filename}"`
        );
        res.setHeader("Content-Type", file.mimetype);
        res.send(file.filedata);

    } catch (err) {
        next(err);
    }
}

async function deleteFile(req, res, next) {
    console.log("Delete File controller Reached");
    try {
        if (!req.user) return res.redirect("/");
        const fileId = Number(req.params.id);
        await db.deleteFileById(fileId, req.user.id);
        res.redirect("/home");
    } catch (err) {
        next(err);
    }
}

module.exports = { showAllUploads, uploadFile, viewFile, deleteFile };