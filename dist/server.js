"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const domain = "localhost";
const address = domain.concat(":", PORT.toString());
app.use(body_parser_1.default.json());
app.get("/", function (req, res) {
    res.send("Welcome to Server");
});
app.listen(PORT, function () {
    console.log(`starting app on: ${address}`);
});
