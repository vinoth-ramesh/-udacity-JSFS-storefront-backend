import { Request, Response, Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import { DashboardQueries } from "../services/Dashboard";

const router = Router();
const dashboard = new DashboardQueries();

const topFiveProducts = async (req: Request, res: Response) => {
  try {
    const products = await dashboard.fivePopularProducts();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

router.use(verifyToken);
router.get("/top-five-popular", topFiveProducts);

export default router;
