// app entry point
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUri from "swagger-ui-express";
import indexRoutes from "./routes/index.routes";
import path from "path";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import cors from "cors";

import { swaggerConfig } from "./swagger.config";
import SocketIO from "./socket/socket";

// app setup
const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// path for jquery on the client and static files
app.use(
  "/lib/jquery",
  express.static(path.join(__dirname, "../node_modules/jquery/dist")),
);
app.use("/public", express.static(path.join(__dirname, "../public")));

// routing
app.use(indexRoutes);

// Swagger
const swaggerDocs = swaggerJsDoc(swaggerConfig); // Genera los documentos
app.use("/api-docs", swaggerUri.serve, swaggerUri.setup(swaggerDocs));

// app listening
const port = process.env["PORT"] || 3000;
const uri = `http://localhost:${port}`;
const appServer = app.listen(port, () =>
  console.log("app is running on " + uri),
);

// socket io
const io = new SocketIO(appServer);
io.setSocketAppFunctionalities();
