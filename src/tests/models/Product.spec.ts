import { query } from "../../database";
import ProductStore from "../../models/Product";
import { resetTables } from "../../utils/resetTables";

const store = new ProductStore();

describe("Product Model", () => {
  beforeAll(async () => {
    await resetTables();
  });

  beforeEach(async () => {
    await query(
      `INSERT INTO products (id, name, price, category) VALUES (1, 'Mango', 257.99, 'fruits')`
    );
  });

  afterEach(async () => {
    await query("DELETE FROM products");
  });

  it("index method should return a list of products", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        name: "Mango",
        price: 257.99,
        category: "fruits",
      },
    ]);
  });

  it("show method should return the correct product", async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      name: "Mango",
      price: 257.99,
      category: "fruits",
    });
  });

  it("create method should add a product", async () => {
    await query("DELETE FROM products");

    const result = await store.create({
      name: "Apple",
      price: 100.99,
      category: "fruits",
    });
    expect(result.name).toEqual("Apple");
    expect(result.price).toEqual(100.99);
    expect(result.category).toEqual("fruits");
  });

  it("delete method should remove the product", async () => {
    await store.delete(1);
    const result = await store.index();
    expect(result).toEqual([]);
  });

  it("update method should update the product", async () => {
    await store.update(1, {
      name: "Watermelon",
      price: 100.99,
      category: "fruits",
    });
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      name: "Watermelon",
      price: 100.99,
      category: "fruits",
    });
  });

  it("should get the correct product by category", async () => {
    const result = await store.category("fruits");
    expect(result).toEqual([
      {
        id: 1,
        name: "Mango",
        price: 257.99,
        category: "fruits",
      },
    ]);
  });
});
