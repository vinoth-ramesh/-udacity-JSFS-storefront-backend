import express, { Request, Response } from "express";
import bodyParser from "body-parser";

require("dotenv").config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

const domain = "localhost";

const address: string = domain.concat(":", PORT.toString());

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Welcome to Server");
});

app.listen(PORT, function () {
  console.log(`starting app on: ${address}`);
});
