"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardQueries = void 0;
const database_1 = require("../database");
class DashboardQueries {
    constructor() {
        // Get 5 top products
        this.fivePopularProducts = async () => {
            try {
                const sql = `
        SELECT prd.id, prd.name, prd.price, prd.category, SUM(ord.quantity) AS total_quantity
        FROM products prd
        JOIN orders_products ord ON prd.id = ord.product_id
        GROUP BY prd.id
        ORDER BY total_quantity DESC
        LIMIT 5
        `;
                const result = await (0, database_1.query)(sql);
                return result.rows;
            }
            catch (error) {
                throw new Error(`Could not get products. Error: ${error}`);
            }
        };
    }
}
exports.DashboardQueries = DashboardQueries;
