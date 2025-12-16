const db = require("../db/queries");
const bcrypt = require("bcryptjs");

async function signUpUser(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).render("sign-up", {
                error: "Username and password are required.",
                username
            });
        }

        const userExists = await db.checkUsernameExists(username);
        if (userExists) {
            return res.status(409).render("sign-up", {
                error: "Username already exists.",
                username
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insertPasswordAndUsername(username, hashedPassword);

        res.redirect("/home");
    } catch (error) {
        next(error);
    }
}

module.exports = { signUpUser };
