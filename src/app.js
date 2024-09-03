import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

// admin imports
import adminRouter from "./routes/admin.routes.js";
import categoryRouter from "./routes/category.routes.js";
import catalogRouter from "./routes/catalog.routes.js";

// store admins imports
import storeAdminRouter from "./routes/store-admin.routes.js";
import storeCatalogRouter from "./routes/catalog.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import customDesignRouter from "./routes/custom-design.routes.js";
import ticketRouter from "./routes/ticket.routes.js";

// store public imports

import storePublicRouter from "./routes/publicShare.routes.js";

// admin routes
app.use("/api/admin", adminRouter);
app.use("/api/admin", categoryRouter);
app.use("/api/admin", catalogRouter);

// store admin routes
app.use("/api/store", storeAdminRouter);
app.use("/api/store", storeCatalogRouter);
app.use("/api/store", orderRouter);
app.use("/api/store", paymentRouter);
app.use("/api/store", customDesignRouter);
app.use("/api/store", ticketRouter);

// public share routes
app.use("/api/public", storePublicRouter);
export { app };
