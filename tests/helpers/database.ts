import { db } from "../../src/database/knex";

type TestUserInput = {
   firstName?: string;
   lastName?: string;
   email?: string;
   phone?: string;
   bvn?: string;
   balance?: number;
};

export const migrateTestDatabase = async () => {
   if (process.env.NODE_ENV !== "test") {
      throw new Error("Refusing to migrate database outside the test environment");
   }

   await db.migrate.latest({
      directory: "src/database/migrations",
      extension: "ts",
   });
};

export const cleanTestDatabase = async () => {
   if (process.env.NODE_ENV !== "test") {
      throw new Error("Refusing to clean database outside the test environment");
   }

   await db("transactions").delete();
   await db("wallets").delete();
   await db("users").delete();
};

export const closeTestDatabase = async () => {
   await db.destroy();
};

export const createTestUserWithWallet = async (input: TestUserInput = {}) => {
   const [userId] = await db("users").insert({
      first_name: input.firstName ?? "Test",
      last_name: input.lastName ?? "User",
      email: input.email ?? `user-${Date.now()}@example.com`,
      phone: input.phone ?? `080${Math.floor(10000000 + Math.random() * 89999999)}`,
      bvn: input.bvn ?? `${Math.floor(10000000000 + Math.random() * 89999999999)}`,
   });

   const [walletId] = await db("wallets").insert({
      user_id: userId,
      balance: input.balance ?? 0,
   });

   return { userId, walletId };
};
