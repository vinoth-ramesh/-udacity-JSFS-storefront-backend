import request from "supertest";
import app from "../../app";
import { query } from "../../database";
import UserStore from "../../models/User";
import { resetTables } from "../../utils/resetTables";

let token: string;

beforeAll(async () => {
  await resetTables();

  const store = new UserStore();

  const user = {
    firstName: "John",
    lastName: "Doe",
    username: "john",
    password: "password",
  };

  await store.create(user);

  const res = await request(app).post("/users/authenticate").send({
    username: "john",
    password: "password",
  });

  token = res.body.token;
});

describe("/products route", () => {
  beforeEach(async () => {
    await query("DELETE FROM products");
    await query(
      `INSERT INTO products (id, name, price, category) VALUES (1, 'Mango', 257.99, 'fruits')`
    );
  });

  it("GET /", async () => {
    const result = await request(app).get("/products");
    expect(result.status).toEqual(200);
    expect(result.body.length).toEqual(1);
  });

  it("GET /:id", async () => {
    const result = await request(app).get("/products/1");
    expect(result.status).toEqual(200);
    expect(result.body.name).toEqual("Mango");
  });

  it("POST /", async () => {
    await query("DELETE FROM products");

    const result = await request(app)
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
    const result = await request(app)
      .delete("/products/1")
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toEqual(204);
    const products = await request(app).get("/products");
    expect(products.body.length).toEqual(0);
  });

  it("GET /category/:category", async () => {
    const result = await request(app).get("/products/category/fruits");
    expect(result.status).toEqual(200);
    expect(result.body.length).toEqual(1);
  });

  afterAll(async () => {
    await resetTables();
  });
});
