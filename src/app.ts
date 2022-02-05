import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import accountRoutes from "./routes/accountRoutes";
import panelRoutes from "./routes/panelRoutes";

dotenv.config({
  path: path.join(__dirname, "../config", "dev.env"),
});

class App {
  public express: express.Application;
  public prisma: PrismaClient;

  public constructor() {
    this.express = express();
    this.prisma = this.database();
    this.middlewares();
    this.routes();
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

  private database() {
    const prisma = new PrismaClient();
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
