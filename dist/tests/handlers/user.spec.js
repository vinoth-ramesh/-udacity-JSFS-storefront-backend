"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const User_1 = __importDefault(require("../../models/User"));
const resetTables_1 = require("../../utils/resetTables");
const store = new User_1.default();
const user = {
    firstName: "John",
    lastName: "Doe",
    username: "john",
    password: "password",
};
const user2 = {
    firstName: "Jane",
    lastName: "Doe",
    username: "jane",
    password: "password",
};
let token;
describe("/users route", () => {
    beforeAll(async () => {
        await store.create(user);
    });
    it("POST /authenticate", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .post("/users/authenticate")
            .send({ username: "john", password: "password" });
        expect(result.status).toEqual(200);
        expect(result.body.token).toBeDefined();
        token = result.body.token;
    });
    it("GET /", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .get("/users")
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toEqual(200);
        expect(result.body.length).toEqual(1);
    });
    it("GET /:id", async () => {
        const result = await (0, supertest_1.default)(app_1.default)
            .get(`/users/1`)
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toEqual(200);
        expect(result.body.firstName).toEqual("John");
    });
    it("POST /", async () => {
        const result = await (0, supertest_1.default)(app_1.default).post("/users").send(user2);
        expect(result.status).toEqual(201);
        expect(result.body.firstName).toEqual("Jane");
    });
    afterAll(async () => {
        await (0, resetTables_1.resetTables)();
    });
});
