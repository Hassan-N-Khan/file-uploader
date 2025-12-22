const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const pool = require("./db/pool");
require('dotenv').config();


//importing routes
const indexRouter = require("./routes/indexRouter");
const signUpRouter = require("./routes/signUpRouter");
const homeRouter = require("./routes/homeRouter");

//rendering views and middlewares
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//styles
const styleSheets = path.join(__dirname, "styles");
app.use(express.static(styleSheets));

app.use(passport.initialize());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

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
  (req, res, next) => {
    console.log("Log-in attempt:", req.body.username);
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/"
  })
);

app.post("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

app.post("/home/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

//using routers
app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.use("/home", homeRouter);


app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
