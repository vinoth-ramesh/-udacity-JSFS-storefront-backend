"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const handlers_1 = require("./handlers");
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
(0, handlers_1.mountRoutes)(app);
app.get("/", async function (req, res) {
    res.send("Welcome to App");
});
exports.default = app;
