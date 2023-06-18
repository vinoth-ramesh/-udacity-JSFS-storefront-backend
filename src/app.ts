import cors from "cors";
import express, { Application, Request, Response } from "express";
import { mountRoutes } from "./handlers";

const app: Application = express();

const corsOptions = {
  origin: "*", // Allowing all the domains
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

mountRoutes(app);

app.get("/", async function (req: Request, res: Response) {
  res.send("Welcome to App");
});

export default app;
