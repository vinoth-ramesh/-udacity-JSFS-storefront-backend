"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountRoutes = void 0;
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const mountRoutes = (app) => {
    app.use("/users", user_routes_1.default);
    app.use("/products", product_routes_1.default);
    app.use("/orders", order_routes_1.default);
    app.use("/dashboard", dashboard_routes_1.default);
};
exports.mountRoutes = mountRoutes;
