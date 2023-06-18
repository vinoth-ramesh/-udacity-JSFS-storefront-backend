"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
var app = (0, express_1["default"])();
var PORT = process.env.PORT || 3000;
var domain = "localhost";
var address = domain.concat(":", PORT.toString());
app.use(body_parser_1["default"].json());
app.get("/", function (req, res) {
    res.send("Welcome to Server");
});
app.listen(PORT, function () {
    console.log("starting app on: ".concat(address));
});
