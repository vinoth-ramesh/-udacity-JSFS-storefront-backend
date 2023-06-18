import { query } from "../database";
import { Product } from "./Product";

type Order = {
  user_id: number;
  status: "active" | "complete";
};

type OrderReturnType = Order & {
  id: number;
};

type OrderProduct = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  index = async (): Promise<OrderReturnType[]> => {
    try {
      const result = await query(`SELECT * FROM orders`);
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch orders: ${error}`);
    }
  };

  show = async (id: number): Promise<OrderReturnType> => {
    try {
      const result = await query(`SELECT * FROM orders WHERE id=($1)`, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to fetch order: ${error}`);
    }
  };

  create = async (order: Order): Promise<OrderReturnType> => {
    try {
      const sql = `INSERT INTO orders (user_id, status) 
        VALUES ($1, $2) RETURNING *`;
      const result = await query(sql, [order.user_id, order.status]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create order: ${error}`);
    }
  };

  delete = async (id: number): Promise<OrderReturnType> => {
    try {
      const sql = `DELETE FROM orders WHERE id=($1) RETURNING *`;
      const result = await query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to delete order: ${error}`);
    }
  };

  update = async (
    id: number,
    status: Order["status"]
  ): Promise<OrderReturnType> => {
    try {
      const sql = `UPDATE orders SET status=($1) WHERE id=($2) RETURNING *`;
      const result = await query(sql, [status, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to update order: ${error}`);
    }
  };

  addProduct = async (
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<OrderProduct> => {
    try {
      const sql = "SELECT * FROM orders WHERE id=($1)";

      const result = await query(sql, [orderId]);

      const order = result.rows[0];

      if (order.status !== "active") {
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
        );
      }
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const sql = `INSERT INTO orders_products (order_id, product_id, quantity) 
        VALUES ($1, $2, $3) RETURNING *`;
      const result = await query(sql, [orderId, productId, quantity]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to add product to order: ${error}`);
    }
  };

  getProducts = async (orderId: number): Promise<Product[]> => {
    try {
      const sql = `SELECT products.* FROM orders_products JOIN products 
        ON orders_products.product_id=products.id WHERE order_id=($1) `;

      const result = await query(sql, [orderId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch products for order: ${error}`);
    }
  };

  currentOrder = async (userId: number): Promise<OrderReturnType> => {
    try {
      const sql = `SELECT * FROM orders WHERE user_id=($1) AND status=($2) ORDER BY id DESC LIMIT 1`;
      const result = await query(sql, [userId, "active"]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to fetch current order: ${error}`);
    }
  };

  completedOrders = async (userId: number): Promise<OrderReturnType[]> => {
    try {
      const sql = `SELECT * FROM orders WHERE user_id=($1) AND status=($2)`;
      const result = await query(sql, [userId, "complete"]);
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch completed orders: ${error}`);
    }
  };
}
