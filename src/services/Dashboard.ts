import { query } from "../database";

export class DashboardQueries {
  // Get 5 top products
  fivePopularProducts = async () => {
    try {
      const sql = `
        SELECT prd.id, prd.name, prd.price, prd.category, SUM(ord.quantity) AS total_quantity
        FROM products prd
        JOIN orders_products ord ON prd.id = ord.product_id
        GROUP BY prd.id
        ORDER BY total_quantity DESC
        LIMIT 5
        `;
      const result = await query(sql);
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get products. Error: ${error}`);
    }
  };
}
