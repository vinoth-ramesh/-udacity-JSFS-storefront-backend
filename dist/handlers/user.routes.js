"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const User_1 = __importDefault(require("../models/User"));
const store = new User_1.default();
const router = (0, express_1.Router)();
const index = async (_req, res) => {
    try {
        const users = await store.index();
        res.json(users);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const show = async (req, res) => {
    try {
        const user = await store.show(Number(req.params.id));
        res.json(user);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const create = async (req, res) => {
    try {
        const newUser = await store.create(req.body);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const authenticate = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await store.authenticate(username, password);
        if (!user) {
            return res.status(401).json("Invalid credentials");
        }
        const token = jsonwebtoken_1.default.sign({ user }, process.env.TOKEN_SECRET, {
            expiresIn: "4h",
        });
        res.json({ token });
    }
    catch (error) {
        res.status(400).json(error);
    }
};
router.post("/authenticate", authenticate);
router.post("/", create);
router.use(verifyToken_1.default);
router.get("/", index);
router.get("/:id", show);
exports.default = router;
