const db = require("../db/queries");
const bcrypt = require("bcryptjs");


async function signUpUser(req, res, next) {
    const strongPasswordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).render("sign-up", {
                error: "Username and password are required.",
                username
            });
        }

        if (!strongPasswordRegex.test(password)) {
            return res.status(400).render("sign-up", {
                error: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
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
        if (error.code === "23505") {
            return res.render("sign-up", {
                error: "Username already exists"
            });
        }
        next(error);
    }
}

module.exports = { signUpUser };
