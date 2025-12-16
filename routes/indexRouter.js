const {Router} = require("express");
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

module.exports = indexRouter;