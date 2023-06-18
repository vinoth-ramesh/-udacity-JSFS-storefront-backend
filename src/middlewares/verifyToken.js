"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    const token = req.header("authorization")?.split(" ")[1];
    if (!token)
        return res.status(401).send("Auth required");
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        req.user = verified.user;
        next();
    }
    catch (error) {
        error instanceof jsonwebtoken_1.default.JsonWebTokenError
            ? res.status(401).send(error.message)
            : error instanceof jsonwebtoken_1.default.TokenExpiredError
                ? res.status(401).send(error.message)
                : error instanceof jsonwebtoken_1.default.NotBeforeError
                    ? res.status(401).send(error.message)
                    : res.status(400).json(error);
    }
};
