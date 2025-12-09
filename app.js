const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });



const pool = new Pool({
    host: "localhost", // or wherever the db is hosted
    user: "hassan",
    database: "fileUploader",
    port: 5432, // The default port
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


//adding user to the db
app.post("/sign-up", async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [req.body.username, hashedPassword]);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//passport configuration
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];

        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
        }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/"
    })
);

//rendering the views
app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});
app.get("/sign-up", (req, res) => res.render("sign-up"));
app.get("/home", async (req, res, next) => {
    if (!req.user) return res.redirect("/");

    try {
        const { rows: files } = await pool.query(
            "SELECT id, filename FROM uploads WHERE user_id = $1 ORDER BY uploaded_at DESC",
            [req.user.id]
        );

        res.render("home", { user: req.user, files });
    } catch (err) {
        next(err);
    }
});


//uploading files
app.post("/upload", upload.single("uploadedFile"), async (req, res) => {
    const { originalname, buffer } = req.file;
    await pool.query(
        "INSERT INTO uploads (user_id, filename, filedata) VALUES ($1, $2, $3)",
        [req.user.id, originalname, buffer]
    );
    res.redirect("/home");
});

app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});




app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
