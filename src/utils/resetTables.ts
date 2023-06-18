import { query } from "../database";

export const resetTables = async (): Promise<void> => {
  await query("DELETE FROM users");
  await query("DELETE FROM orders_products");
  await query("DELETE FROM orders");
  await query("DELETE FROM products");
  await query(`ALTER SEQUENCE "users_id_seq" RESTART WITH 1`);
  await query(`ALTER SEQUENCE "orders_products_id_seq" RESTART WITH 1`);
  await query(`ALTER SEQUENCE "orders_id_seq" RESTART WITH 1`);
  await query(`ALTER SEQUENCE "products_id_seq" RESTART WITH 1`);
};
