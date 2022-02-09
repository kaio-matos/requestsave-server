import { Product } from "@prisma/client";

type ProductBasicsType = Omit<Product, "id" | "createdAt" | "updatedAt">;

export { ProductBasicsType };
