import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app: express.Application = express();
const PORT = process.env.PORT || 5000;

const domain = "0.0.0.0";

const address: string = domain.concat(":", PORT.toString());

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Welcome to Server");
});

app.listen(PORT, function () {
  console.log(`starting app on: ${address}`);
});
