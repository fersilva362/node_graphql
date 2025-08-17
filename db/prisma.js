import { PrismaClient } from "../generated/prisma/index.js";

let prisma;

try {
  prisma = new PrismaClient();

  // Test connection immediately
  prisma
    .$connect()
    .then(() => console.log("Prisma connected successfully"))
    .catch((err) => console.error("Prisma connection error:", err));
} catch (error) {
  console.error("Prisma initialization error:", error);
  throw new Error(
    'Failed to initialize Prisma Client - did you run "prisma generate"?'
  );
}

export default prisma;
