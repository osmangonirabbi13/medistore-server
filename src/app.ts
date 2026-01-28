import { toNodeHandler } from "better-auth/node";
import express, { Request, Response } from "express";
import { sellerRouter } from "./Seller/seller.routes";
import { auth } from "./lib/auth";
import cors from "cors";
import { categoryRouter } from "./Category/category.routes";
import { productRoute } from "./Product/product.routes";
import { orderRouter } from "./order/order.routes";
import { adminRoute } from "./admin/admin.routes";
import { profileRouter } from "./profile/profile.route";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/profile" , profileRouter)

app.use("/api/admin" , adminRoute)

app.use("/api/medicines", productRoute);

app.use("/api/seller", sellerRouter);

app.use("/api/categories", categoryRouter);

app.use("/api/orders", orderRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

export default app;
