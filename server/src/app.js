import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import urlRoutes from "./routes/urlRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const App = express();

App.use(express.json());
App.use(cors());
App.use(helmet());
App.use(morgan("dev"));

App.use("/api/auth", authRoutes);
App.use("/api/url", urlRoutes);

App.use(errorHandler);

export default App;