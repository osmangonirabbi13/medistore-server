import { toNodeHandler } from "better-auth/node";
import express, { Request, Response } from "express";
import { sellerRouter } from "./Seller/seller.routes";
import { auth } from "./lib/auth";
import cors from "cors";
import { categoryRouter } from "./Category/category.routes";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/seller", sellerRouter);

app.use("/api/categories" , categoryRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});
export default app;
