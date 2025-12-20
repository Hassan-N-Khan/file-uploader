const {Router} = require("express");
const homeRouter = Router();
const { showAllUploads, uploadFile } = require("../controller/homeController");


const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

homeRouter.get("/",  (req, res, next) =>{
    console.log("Home route hit");
    showAllUploads(req, res, next);
});

homeRouter.post("/upload", upload.single("uploadedFile"), (req, res, next) => {
    console.log("Home upload route hit");
    uploadFile(req, res, next);
});


module.exports = homeRouter;