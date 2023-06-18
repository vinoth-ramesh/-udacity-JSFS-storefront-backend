"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database");
const User_1 = __importDefault(require("../../models/User"));
const resetTables_1 = require("../../utils/resetTables");
const store = new User_1.default();
describe("User Model", () => {
    beforeAll(async () => {
        await (0, resetTables_1.resetTables)();
    });
    beforeEach(async () => {
        await (0, database_1.query)(`INSERT INTO users (id, "firstName", "lastName", password_digest, username) VALUES (1,'John', 'Doe', 'password', 'john')`);
    });
    afterEach(async () => {
        await (0, database_1.query)("DELETE FROM users");
    });
    it("should return a user", async () => {
        expect(store.show).toBeDefined();
        const result = await store.show(1);
        expect(result.firstName).toEqual("John");
        expect(result.lastName).toEqual("Doe");
    });
    it("should return a list of users", async () => {
        expect(store.index).toBeDefined();
        const result = await store.index();
        expect(result.length).toEqual(1);
    });
    it("should create a user", async () => {
        await (0, database_1.query)("DELETE FROM users");
        expect(store.create).toBeDefined();
        const result = await store.create({
            firstName: "Jane",
            lastName: "Doe",
            username: "jane",
            password: "password",
        });
        expect(result.firstName).toEqual("Jane");
        expect(result.lastName).toEqual("Doe");
    });
    it("should throw error if username is taken already", async () => {
        await expectAsync(store.create({
            username: "john",
            firstName: "name",
            lastName: "name",
            password: "password",
        })).toBeRejected();
    });
    afterAll(async () => await (0, resetTables_1.resetTables)());
});
