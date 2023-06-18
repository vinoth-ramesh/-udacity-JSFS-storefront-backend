"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class ProductStore {
    constructor() {
        this.index = async () => {
            try {
                const result = await (0, database_1.query)(`SELECT * FROM products`);
                return result.rows;
            }
            catch (error) {
                throw new Error(`Unable to fetch products: ${error}`);
            }
        };
        this.show = async (id) => {
            try {
                const result = await (0, database_1.query)(`SELECT * FROM products WHERE id=($1)`, [id]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to fetch product: ${error}`);
            }
        };
        this.create = async (product) => {
            try {
                const sql = `INSERT INTO products (name, price, category) 
        VALUES ($1, $2, $3) RETURNING *`;
                const result = await (0, database_1.query)(sql, [
                    product.name,
                    product.price,
                    product.category,
                ]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to create product: ${error}`);
            }
        };
        this.delete = async (id) => {
            try {
                const sql = `DELETE FROM products WHERE id=($1) RETURNING *`;
                const result = await (0, database_1.query)(sql, [id]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to delete product: ${error}`);
            }
        };
        this.update = async (id, product) => {
            try {
                const sql = `UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *`;
                const result = await (0, database_1.query)(sql, [
                    product.name,
                    product.price,
                    product.category,
                    id,
                ]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Unable to update product: ${error}`);
            }
        };
        this.category = async (category) => {
            try {
                const sql = `SELECT * FROM products WHERE category=($1)`;
                const result = await (0, database_1.query)(sql, [category]);
                return result.rows;
            }
            catch (error) {
                throw new Error(`Unable to fetch products: ${error}`);
            }
        };
    }
}
exports.default = ProductStore;
