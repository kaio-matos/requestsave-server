import { Request } from "@prisma/client";

interface RequestBasicsType extends Omit<Request, "id" | "createdAt" | "updatedAt"> {
  status: "TODO" | "GRAPHIC" | "DEALING" | "CANCELLED" | "COMPLETED";
}

export { RequestBasicsType };
