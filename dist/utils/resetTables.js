"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTables = void 0;
const database_1 = require("../database");
const resetTables = async () => {
    await (0, database_1.query)("DELETE FROM users");
    await (0, database_1.query)("DELETE FROM orders_products");
    await (0, database_1.query)("DELETE FROM orders");
    await (0, database_1.query)("DELETE FROM products");
    await (0, database_1.query)(`ALTER SEQUENCE "users_id_seq" RESTART WITH 1`);
    await (0, database_1.query)(`ALTER SEQUENCE "orders_products_id_seq" RESTART WITH 1`);
    await (0, database_1.query)(`ALTER SEQUENCE "orders_id_seq" RESTART WITH 1`);
    await (0, database_1.query)(`ALTER SEQUENCE "products_id_seq" RESTART WITH 1`);
};
exports.resetTables = resetTables;
