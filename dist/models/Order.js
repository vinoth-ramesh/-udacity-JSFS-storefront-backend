"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = require("../database");
class OrderStore {
    constructor() {
        this.index = async () => {
            try {
                const result = await (0, database_1.query)(`SELECT * FROM orders`);
                return result.rows;
            }
            catch (error) {
                throw new Error(`Unable to fetch orders: ${error}`);
            }
        };
        this.show = async (id) => {
            try {
                const result = await (0, database_1.query)(`SELECT * FROM orders WHERE id=($1)`, [id]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to fetch order: ${error}`);
            }
        };
        this.create = async (order) => {
            try {
                const sql = `INSERT INTO orders (user_id, status) 
        VALUES ($1, $2) RETURNING *`;
                const result = await (0, database_1.query)(sql, [order.user_id, order.status]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to create order: ${error}`);
            }
        };
        this.delete = async (id) => {
            try {
                const sql = `DELETE FROM orders WHERE id=($1) RETURNING *`;
                const result = await (0, database_1.query)(sql, [id]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to delete order: ${error}`);
            }
        };
        this.update = async (id, status) => {
            try {
                const sql = `UPDATE orders SET status=($1) WHERE id=($2) RETURNING *`;
                const result = await (0, database_1.query)(sql, [status, id]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to update order: ${error}`);
            }
        };
        this.addProduct = async (orderId, productId, quantity) => {
            try {
                const sql = "SELECT * FROM orders WHERE id=($1)";
                const result = await (0, database_1.query)(sql, [orderId]);
                const order = result.rows[0];
                if (order.status !== "active") {
                    throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`);
                }
            }
            catch (err) {
                throw new Error(`${err}`);
            }
            try {
                const sql = `INSERT INTO orders_products (order_id, product_id, quantity) 
        VALUES ($1, $2, $3) RETURNING *`;
                const result = await (0, database_1.query)(sql, [orderId, productId, quantity]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to add product to order: ${error}`);
            }
        };
        this.getProducts = async (orderId) => {
            try {
                const sql = `SELECT products.* FROM orders_products JOIN products 
        ON orders_products.product_id=products.id WHERE order_id=($1) `;
                const result = await (0, database_1.query)(sql, [orderId]);
                return result.rows;
            }
            catch (error) {
                throw new Error(`Unable to fetch products for order: ${error}`);
            }
        };
        this.currentOrder = async (userId) => {
            try {
                const sql = `SELECT * FROM orders WHERE user_id=($1) AND status=($2) ORDER BY id DESC LIMIT 1`;
                const result = await (0, database_1.query)(sql, [userId, "active"]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to fetch current order: ${error}`);
            }
        };
        this.completedOrders = async (userId) => {
            try {
                const sql = `SELECT * FROM orders WHERE user_id=($1) AND status=($2)`;
                const result = await (0, database_1.query)(sql, [userId, "complete"]);
                return result.rows;
            }
            catch (error) {
                throw new Error(`Unable to fetch completed orders: ${error}`);
            }
        };
    }
}
exports.OrderStore = OrderStore;
