"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const database_1 = require("../../database");
const User_1 = __importDefault(require("../../models/User"));
const resetTables_1 = require("../../utils/resetTables");
let authedUser;
let token;
describe("/orders route", () => {
    beforeAll(async () => {
        await (0, resetTables_1.resetTables)();
        const store = new User_1.default();
        const user = {
            firstName: "John",
            lastName: "Doe",
            username: "john",
            password: "password",
        };
        authedUser = await store.create(user);
        const res = await (0, supertest_1.default)(app_1.default).post("/users/authenticate").send({
            username: "john",
            password: "password",
        });
        token = res.body.token;
    });
    beforeEach(async () => {
        await (0, database_1.query)(`INSERT INTO orders (id, user_id, status) VALUES (1, $1, 'active')`, [authedUser.id]);
    });
    afterEach(async () => {
        await (0, database_1.query)("DELETE FROM orders");
        await (0, database_1.query)("DELETE FROM products");
    });
    it("GET /", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .get("/orders")
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toEqual(200);
        expect(result.body.length).toEqual(1);
    });
    it("GET /:id", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .get("/orders/1")
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toEqual(200);
        expect(result.body.user_id).toEqual(authedUser.id);
    });
    it("POST /", async () => {
        await (0, database_1.query)("DELETE FROM orders");
        const result = await (0, supertest_1.default)(app_1.default)
            .post("/orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
            user_id: authedUser.id,
            status: "active",
        });
        expect(result.status).toEqual(200);
        expect(result.body.user_id).toEqual(authedUser.id);
    });
    it("PUT /:id", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .put("/orders/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
            status: "complete",
        });
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual("complete");
    });
    it("DELETE /:id", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .delete("/orders/1")
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toEqual(204);
    });
    it("POST /:id/products", async () => {
        await (0, database_1.query)(`INSERT INTO products (id, name, price, category) VALUES (1, 'Mango', 257.99, 'fruits')`);
        const result = await (0, supertest_1.default)(app_1.default)
            .post("/orders/1/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
            productId: 1,
            quantity: 2,
        });
        expect(result.status).toEqual(200);
        expect(result.body.quantity).toEqual(2);
    });
    it("GET /:id/products", async () => {
        await (0, database_1.query)(`INSERT INTO products (id, name, price, category) VALUES (1, 'Mango', 257.99, 'fruits')`);
        await (0, database_1.query)(`INSERT INTO orders_products (order_id, product_id, quantity) VALUES (1, 1, 2)`);
        const result = await (0, supertest_1.default)(app_1.default)
            .get("/orders/1/products")
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toEqual(200);
        expect(result.body.length).toEqual(1);
    });
    it("GET /current", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .get("/orders/current")
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual({ id: 1, user_id: 1, status: "active" });
    });
    it("GET /complete", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .get("/orders/complete")
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual([]);
    });
});
