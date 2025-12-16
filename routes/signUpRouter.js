const { Router } = require("express");
const signUpRouter = Router();
const { signUpUser } = require("../controller/signUpController.js");

signUpRouter.get("/", (req, res) => {
    res.render("sign-up", {
        error: null,
        username: ""
    });
});


signUpRouter.post("/", signUpUser);

module.exports = signUpRouter;
