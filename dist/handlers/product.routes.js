"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const Product_1 = __importDefault(require("../models/Product"));
const store = new Product_1.default();
const router = (0, express_1.Router)();
const index = async (req, res) => {
    try {
        const products = await store.index();
        res.json(products);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const show = async (req, res) => {
    try {
        const product = await store.show(Number(req.params.id));
        res.json(product);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const create = async (req, res) => {
    try {
        const newProduct = await store.create(req.body);
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const update = async (req, res) => {
    try {
        const updated = await store.update(Number(req.params.id), req.body);
        res.json(updated);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const destroy = async (req, res) => {
    try {
        const product = await store.delete(Number(req.params.id));
        res.status(204).json(product);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const category = async (req, res) => {
    try {
        const products = await store.category(req.params.category);
        res.json(products);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
router.get("/", index);
router.get("/category/:category", category);
router.get("/:id", show);
router.post("/", verifyToken_1.default, create);
router.put("/:id", verifyToken_1.default, update);
router.delete("/:id", verifyToken_1.default, destroy);
exports.default = router;
