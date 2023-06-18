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
let token;
beforeAll(async () => {
    await (0, resetTables_1.resetTables)();
    const store = new User_1.default();
    const user = {
        firstName: "John",
        lastName: "Doe",
        username: "john",
        password: "password",
    };
    await store.create(user);
    const res = await (0, supertest_1.default)(app_1.default).post("/users/authenticate").send({
        username: "john",
        password: "password",
    });
    token = res.body.token;
});
describe("/products route", () => {
    beforeEach(async () => {
        await (0, database_1.query)("DELETE FROM products");
        await (0, database_1.query)(`INSERT INTO products (id, name, price, category) VALUES (1, 'Mango', 257.99, 'fruits')`);
    });
    it("GET /", async () => {
        const result = await (0, supertest_1.default)(app_1.default).get("/products");
        expect(result.status).toEqual(200);
        expect(result.body.length).toEqual(1);
    });
    it("GET /:id", async () => {
        const result = await (0, supertest_1.default)(app_1.default).get("/products/1");
        expect(result.status).toEqual(200);
        expect(result.body.name).toEqual("Mango");
    });
    it("POST /", async () => {
        await (0, database_1.query)("DELETE FROM products");
        const result = await (0, supertest_1.default)(app_1.default)
            .post("/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
            name: "Apple",
            price: 100.99,
            category: "fruits",
        });
        expect(result.status).toEqual(201);
        expect(result.body.name).toEqual("Apple");
    });
    it("DELETE /:id", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .delete("/products/1")
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toEqual(204);
        const products = await (0, supertest_1.default)(app_1.default).get("/products");
        expect(products.body.length).toEqual(0);
    });
    it("GET /category/:category", async () => {
        const result = await (0, supertest_1.default)(app_1.default).get("/products/category/fruits");
        expect(result.status).toEqual(200);
        expect(result.body.length).toEqual(1);
    });
    afterAll(async () => {
        await (0, resetTables_1.resetTables)();
    });
});
