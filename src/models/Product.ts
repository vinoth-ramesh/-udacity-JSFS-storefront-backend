import { query } from "../database";

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export default class ProductStore {
  index = async (): Promise<Product[]> => {
    try {
      const result = await query(`SELECT * FROM products`);
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch products: ${error}`);
    }
  };

  show = async (id: number): Promise<Product> => {
    try {
      const result = await query(`SELECT * FROM products WHERE id=($1)`, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to fetch product: ${error}`);
    }
  };

  create = async (product: Product): Promise<Product> => {
    try {
      const sql = `INSERT INTO products (name, price, category) 
        VALUES ($1, $2, $3) RETURNING *`;
      const result = await query(sql, [
        product.name,
        product.price,
        product.category,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create product: ${error}`);
    }
  };

  delete = async (id: number): Promise<Product> => {
    try {
      const sql = `DELETE FROM products WHERE id=($1) RETURNING *`;
      const result = await query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to delete product: ${error}`);
    }
  };

  update = async (id: number, product: Product): Promise<Product> => {
    try {
      const sql = `UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *`;
      const result = await query(sql, [
        product.name,
        product.price,
        product.category,
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to update product: ${error}`);
    }
  };

  category = async (category: string): Promise<Product[]> => {
    try {
      const sql = `SELECT * FROM products WHERE category=($1)`;
      const result = await query(sql, [category]);
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch products: ${error}`);
    }
  };
}
