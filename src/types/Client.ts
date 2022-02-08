import { Client } from "@prisma/client";

type ClientBasicsType = Omit<Client, "id" | "createdAt" | "updatedAt">;

export { ClientBasicsType };
