import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { App } from "./app.js";
import "./views/helpers/renderUnitsSummary.js";
import "./views/helpers/renderArticleIcon.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootDir = path.resolve(__dirname, "..");

const config = {
    paths: {
        root: __rootDir,
        logs: path.join(__rootDir, "logs"),
        public: path.join(__rootDir, "public"),
        views: path.join(__dirname, "views"),
    },
};

const mode = process.argv[2] || "run";

const app = new App(config);
app.run(mode);