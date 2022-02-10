import { PrismaClient } from "@prisma/client";
import { EncryptPassword } from "./middlewares/Account";

export class Database {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();

    this.middlewares();
    this.checkAdminExist();
  }

  middlewares() {
    this.prisma.$use(EncryptPassword);
  }

  checkAdminExist() {
    this.prisma.account
      .findMany()
      .then((accounts) => {
        if (accounts.length === 0) return this.createFirstAdmin();

        const admins = accounts.filter((acc) => acc.role === "ADMIN");
        if (admins.length === 0) return this.createFirstAdmin();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createFirstAdmin() {
    const connectOrCreate = {
      phoneNumber: "admin",
    };

    await this.prisma.account.create({
      data: {
        firstName: "admin",
        lastName: "admin",
        email: "admin",
        password: "admin",
        role: "ADMIN",
        confirmedEmail: true,
        accountTie: {
          connectOrCreate: {
            where: connectOrCreate,
            create: connectOrCreate,
          },
        },
      },
    });
  }
}
