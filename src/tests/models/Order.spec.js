"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database");
const Order_1 = require("../../models/Order");
const User_1 = __importDefault(require("../../models/User"));
const resetTables_1 = require("../../utils/resetTables");
const store = new Order_1.OrderStore();
const userStore = new User_1.default();
const user = {
    firstName: "John",
    lastName: "Doe",
    username: "john",
    password: "password",
};
let userId;
describe("Order Model", () => {
    beforeAll(async () => {
        await (0, resetTables_1.resetTables)();
        const authUser = await userStore.create(user);
        userId = authUser.id;
    });
    beforeEach(async () => {
        await (0, database_1.query)(`INSERT INTO orders (id, user_id, status) VALUES (1, $1, 'active')`, [userId]);
    });
    afterEach(async () => {
        await (0, database_1.query)("DELETE FROM orders");
    });
    it("index method should return a list of orders", async () => {
        const result = await store.index();
        expect(result).toEqual([
            {
                id: 1,
                user_id: 1,
                status: "active",
            },
        ]);
    });
    it("show method should return the correct order", async () => {
        const result = await store.show(1);
        expect(result).toEqual({
            id: 1,
            user_id: 1,
            status: "active",
        });
    });
    it("create method should add a order", async () => {
        await (0, database_1.query)("DELETE FROM orders");
        const result = await store.create({
            user_id: 1,
            status: "active",
        });
        expect(result.user_id).toEqual(1);
        expect(result.status).toEqual("active");
    });
    it("delete method should remove the order", async () => {
        await store.delete(1);
        const result = await store.index();
        expect(result).toEqual([]);
    });
    it("update method should update the order status", async () => {
        await store.update(1, "complete");
        const result = await store.show(1);
        expect(result).toEqual({
            id: 1,
            user_id: 1,
            status: "complete",
        });
    });
    it("addProduct method should add a product to the order", async () => {
        await (0, database_1.query)(`INSERT INTO products (id, name, price, category) VALUES (1, 'test', 1, 'test')`);
        await store.addProduct(1, 1, 1);
        const result = await (0, database_1.query)(`SELECT * FROM orders_products WHERE order_id = 1 AND product_id = 1`);
        expect(result.rows[0]).toEqual({
            id: 1,
            order_id: 1,
            product_id: 1,
            quantity: 1,
        });
    });
    it("addProduct method should throw error if order is not active", async () => {
        await (0, database_1.query)(`DELETE FROM products`);
        await (0, database_1.query)(`INSERT INTO products (id, name, price, category) VALUES (1, 'test', 1, 'test')`);
        await (0, database_1.query)(`UPDATE orders SET status = 'complete' WHERE id = 1`);
        expectAsync(store.addProduct(1, 1, 1)).toBeRejected();
    });
    it("currentOrders method should return the current order", async () => {
        const result = await store.currentOrder(userId);
        expect(result).toEqual({
            id: 1,
            user_id: 1,
            status: "active",
        });
    });
    it("completedOrders method should return the completed orders", async () => {
        await (0, database_1.query)(`UPDATE orders SET status = 'complete' WHERE id = 1`);
        const result = await store.completedOrders(userId);
        expect(result).toEqual([
            {
                id: 1,
                user_id: 1,
                status: "complete",
            },
        ]);
    });
    it("getProducts method should return the products in the order", async () => {
        await (0, database_1.query)(`DELETE FROM products`);
        await (0, database_1.query)(`INSERT INTO products (id, name, price, category) VALUES (1, 'test', 1, 'test'), (2, 'test2', 2, 'test2')`);
        await (0, database_1.query)(`INSERT INTO orders_products (order_id, product_id, quantity) VALUES (1, 1, 1), (1, 2, 2)`);
        const result = await store.getProducts(1);
        expect(result).toEqual([
            { id: 1, name: "test", price: 1, category: "test" },
            { id: 2, name: "test2", price: 2, category: "test2" },
        ]);
    });
});
