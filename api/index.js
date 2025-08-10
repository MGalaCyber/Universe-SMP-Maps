const Fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const CookieParser = require("cookie-parser");
const proxy = require("express-http-proxy");
const { createProxyMiddleware } = require("http-proxy-middleware");
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

// app.use("/proxy", proxy("http://play.universesmp.xyz:25615", {
//     proxyReqPathResolver: (req) => {
//         const targetPath = req.originalUrl.replace(/^\/proxy/, "");
//         console.log(`Proxying to: http://play.universesmp.xyz:25615${targetPath}`);
//         return targetPath;
//     },
//     userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
//         console.log(`Response status: ${proxyRes.statusCode} for ${userReq.originalUrl}`);
//         return proxyResData;
//     }
// }));

app.use("/proxy", createProxyMiddleware({
    target: "http://play.universesmp.xyz:25615",
    changeOrigin: true,
    pathRewrite: {
        "^/proxy": "", // Hapus "/proxy" sebelum diteruskan ke target
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log("Proxying:", req.originalUrl);
    },
}));

app.use((req, res) => {
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});