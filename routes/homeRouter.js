const {Router} = require("express");
const homeRouter = Router();
const { showAllUploads, uploadFile, viewFile, deleteFile } = require("../controller/homeController");


const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

homeRouter.get("/",  (req, res, next) =>{
    showAllUploads(req, res, next);
});

homeRouter.post("/upload", upload.single("uploadedFile"), (req, res, next) => {
    uploadFile(req, res, next);
});

homeRouter.get("/file/:id", viewFile);

homeRouter.post("/delete/:id", (req, res, next) => {
    console.log("Delete File route Reached");
    deleteFile(req, res, next);
});


module.exports = homeRouter;