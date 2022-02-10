import { PrismaClient } from "@prisma/client";

import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";

import accountRoutes from "./routes/accountRoutes";
import panelRoutes from "./routes/panelRoutes";
import errorMiddleware from "./middlewares/errorMiddleware";
import { Database } from "./database/Database";

class App {
  public express: express.Application;
  public prisma: PrismaClient;

  public constructor() {
    this.express = express();
    this.prisma = this.database();
    this.middlewares();
    this.routes();
    this.errorMiddleware();
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(cookieParser());
    this.express.use(
      cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
      })
    );
  }

  private errorMiddleware() {
    this.express.use(errorMiddleware);
  }

  private database() {
    const prisma = new Database().prisma;
    return prisma;
  }

  private routes(): void {
    this.express.use("/api/account", accountRoutes);
    this.express.use("/api/panel", panelRoutes);
  }
}

const Application = new App();
const app = Application.express;
const prisma = Application.prisma;

export { app, prisma };
