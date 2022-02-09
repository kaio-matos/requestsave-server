import { AccountTie } from "@prisma/client";

type AccountTieBasicsType = Omit<AccountTie, "id" | "createdAt" | "updatedAt">;

export { AccountTieBasicsType };
