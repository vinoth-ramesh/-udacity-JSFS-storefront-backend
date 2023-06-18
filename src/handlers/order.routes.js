"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const Order_1 = require("../models/Order");
const store = new Order_1.OrderStore();
const router = (0, express_1.Router)();
const index = async (_req, res) => {
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
        const product = await store.show(parseInt(req.params.id));
        res.json(product);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const create = async (req, res) => {
    try {
        const product = await store.create(req.body);
        res.json(product);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const update = async (req, res) => {
    try {
        const product = await store.update(parseInt(req.params.id), req.body.status);
        res.json(product);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const destroy = async (req, res) => {
    try {
        const product = await store.delete(parseInt(req.params.id));
        res.status(204).json(product);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const addProduct = async (req, res) => {
    try {
        const product = await store.addProduct(parseInt(req.params.id), parseInt(req.body.productId), parseInt(req.body.quantity));
        res.json(product);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const getProducts = async (req, res) => {
    try {
        const products = await store.getProducts(parseInt(req.params.id));
        res.json(products);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const currentOrder = async (req, res) => {
    try {
        const order = await store.currentOrder(req.user?.id);
        res.json(order);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const completedOrders = async (req, res) => {
    try {
        const orders = await store.completedOrders(req.user?.id);
        res.json(orders);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
router.use(verifyToken_1.default);
router.route("/").get(index).post(create);
router.route("/current").get(currentOrder);
router.route("/complete").get(completedOrders);
router.route("/:id").get(show).put(update).delete(destroy);
router.route("/:id/products").post(addProduct).get(getProducts);
exports.default = router;
