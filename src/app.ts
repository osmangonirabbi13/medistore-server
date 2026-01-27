import express, { Request, Response } from "express";
import { sellerRouter } from "./Seller/seller.routes";

const app = express();
app.use(express.json());


app.use("/api/seller", sellerRouter );


app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});
export default app;
