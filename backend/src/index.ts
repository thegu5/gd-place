import * as dotenv from "dotenv";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { getAccountId } from "./gd";

//const expressSvelte = require("express-svelte");

dotenv.config();

// const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//     const status = err.status || 500;
//     const message =
//         err.message || "Oops. Something went wrong. Please try again later!";
//     res.status(status).send({
//         status,
//         message,
//     });
// };

const PORT: number = parseInt(process.env.PORT || "8090", 10);
const HOST: string | undefined =
    process.env.PROD === "true" ? process.env.PROD_HOST : process.env.DEV_HOST;

const app = express();

let currentCodes: number[] = [];

const getNewUnusedCode = (): number => {
    const n = crypto.randomInt(0, 999999);

    if (currentCodes.indexOf(n) !== -1) {
        return getNewUnusedCode();
    }

    return n;
};

// TODO: trust proxy if using cloudflare
// app.use(
//     rateLimit({
//         windowMs: 5 * 60 * 1000, // 5 minutes
//         max: 10, // 10 requests per 5 minutes
//         standardHeaders: true,
//         legacyHeaders: false,
//     })
// );

// console.log(__dirname);

// // app.use("/public", express.static(PUBLIC));

// app.use(
//     expressSvelte({
//         legacy: false,
//         hydratable: true,
//         viewsDirname: SVELTE,
//         bundlesDirname: PUBLIC + "/dist",
//         bundlesHost: "/public/dist",
//         bundlesPattern: "[name][extname]",
//         env: process.env.NODE_ENV,
//     })
// );
// app.use(helmet());
app.use(
    cors({
        origin: HOST,
        optionsSuccessStatus: 200,
    })
);
app.use(express.json());

app.post("/gd/message/:user", async (req, _, __) => {
    getAccountId(req.params.user)
        .then(id => console.log(id))
        .catch(err => console.log(err));
    // res.send({ code: getNewUnusedCode() });
});

app.post("/gd/code", (_, res, __) => {});

app.get("/:_*", (_, res, __) => {
    res.redirect("/");
});

// app.get("/", (req, res, next) => {
//     // @ts-ignore
//     res.svelte("App.svelte");
// });

//app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
