const Fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const CookieParser = require("cookie-parser");
const Express = require("express");
const Cors = require("cors");
const Path = require("path");
const Ejs = require("ejs");
require("dotenv").config();

const app = Express();
app.set("trust proxy", 1);
app.engine("html", Ejs.renderFile);
app.set("view engine", "html");
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(CookieParser());
app.use(Cors());
app.set("views", Path.join(__dirname, "../views"));
app.use(Express.static(Path.join(__dirname, "../assets")));

// Tambahkan CSP Header
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "frame-ancestors *");
    next();
});

app.get("/", (req, res) => {
    res.render("index");
});

app.use((req, res) => {
    res.redirect("/");
});

// Handler untuk Vercel API
module.exports = app;
