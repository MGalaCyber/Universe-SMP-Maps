const Fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const CookieParser = require("cookie-parser");
const Express = require("express");
const Cors = require("cors");
const Path = require("path");
const Ejs = require("ejs");
require("dotenv").config();

const app = Express();
const port = process.env.PORT || 3001;

app.set("trust proxy", 1);
app.engine("html", Ejs.renderFile);
app.set("view engine", "html");
app.use(Express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "frame-ancestors *");
    next();
});
app.use(Express.json());
app.use(CookieParser());
app.use(Cors());
app.set("views", Path.join(__dirname, "../views"));
app.use(Express.static(Path.join(__dirname, "../assets")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/proxy", async (req, res) => {
    const response = await Fetch("http://play.universesmp.xyz:25615/");
    const body = await response.text();
    res.send(body);
});


app.use((req, res) => {
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});