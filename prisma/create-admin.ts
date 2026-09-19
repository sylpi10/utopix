import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// Creates an admin, or resets its password if the email already exists.
// Usage: tsx prisma/create-admin.ts <email> [password]
// If no password is given, a random one is generated and printed once.
async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx prisma/create-admin.ts <email> [password]");
    process.exitCode = 1;
    return;
  }

  const password = process.argv[3] ?? randomBytes(9).toString("base64url");
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log("\n=== Compte admin prêt ===");
  console.log(`Email    : ${admin.email}`);
  console.log(`Password : ${password}`);
  console.log("A changer une fois connecté si tu veux ton propre mot de passe.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
