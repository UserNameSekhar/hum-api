import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routers/users/usersRouter";
import categoriesRouter from "./routers/categories/categoriesRouter";
import productsRouter from "./routers/products/productsRouter";
import addressRouter from "./routers/addresses/addressRouter";
import cartRouter from "./routers/carts/cartRouter";
import ordersRouter from "./routers/orders/ordersRouter";
import { DBUtil } from "./database/DBUtil";

//initialize the express js
const app: express.Application = express();

//configure cors policy
app.use(cors());

//configure dot-env
dotenv.config({
  path: "./.env",
});

//configure express to read form data
app.use(express.json());

const port: number | undefined = Number(process.env.PORT) || 9000;
const dbUrl: string | undefined = process.env.EXPRESS_APP_MONGODB_CLOUD_URL;
const dbName: string | undefined = process.env.EXPRESS_APP_MONGODB_DATABASE;

// Log the environment variables to ensure they are loaded
if (port && dbUrl && dbName) {
  console.log(`\nEnvironment Variables :`);
  console.log(`---------------------------`);
  console.log("PORT :", 9000);

  console.log(
    "DATABASE URL :",
    process.env.EXPRESS_APP_MONGODB_CLOUD_URL
  );
  console.log(
    "DATABASE NAME :",
    process.env.EXPRESS_APP_MONGODB_DATABASE
  );
}

app.get("/", (request: Request, response: Response) => {
  response.status(200);
  response.json({
    msg: "Welcome to React E-Commerce App",
  });
});

//Rotuer configuration
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", ordersRouter);

if (port && dbUrl && dbName) {
  app.listen(port, () => {
    console.log(`\nServer started at port ${port}`);
``
    DBUtil.connectToDB(dbUrl, dbName)
      .then((dbResponse) => {
        console.log(dbResponse);
      })
      .catch((error) => {
        console.error("DB Connection Error:", error);
        process.exit(1); // Exit the process with a failure code
      });
  });
} else {
  console.error(
    "Missing environment variables: PORT, EXPRESS_APP_MONGODB_CLOUD_URL, or EXPRESS_APP_MONGODB_DATABASE"
  );
  process.exit(1); // Exit the process with a failure code
}
