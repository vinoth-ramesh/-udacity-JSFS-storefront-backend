"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const Dashboard_1 = require("../services/Dashboard");
const router = (0, express_1.Router)();
const dashboard = new Dashboard_1.DashboardQueries();
const topFiveProducts = async (req, res) => {
    try {
        const products = await dashboard.fivePopularProducts();
        res.json(products);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};
router.use(verifyToken_1.default);
router.get("/top-five-popular", topFiveProducts);
exports.default = router;
