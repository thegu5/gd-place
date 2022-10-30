import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";

dotenv.config();

const PORT: number = parseInt(process.env.PORT || "8080", 10);

const app = express();

let currentCodes: number[] = [];

const getNewUnusedCode = (): number => {
    const n = crypto.randomInt(0, 999999);

    if (currentCodes.indexOf(n)) {
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

var corsOptions = {
    origin: "https://localhost",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.post("/gd/user", () => {});

app.post("/gd/code", () => {});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
