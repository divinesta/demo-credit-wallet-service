import request from "supertest";

import { createApp } from "../../src/app";
import { db } from "../../src/database/knex";
import { cleanTestDatabase, closeTestDatabase, migrateTestDatabase } from "../helpers/database";

describe("Wallet withdrawal", () => {
   const app = createApp();

   beforeAll(async () => {
      await migrateTestDatabase();
   });

   beforeEach(async () => {
      await cleanTestDatabase();
   });

   afterAll(async () => {
      await closeTestDatabase();
   });

   const createFundedWallet = async (balance: number) => {
      const [userId] = await db("users").insert({
         first_name: "Ada",
         last_name: "Test",
         email: "withdrawal-test@example.com",
         phone: "08020000001",
         bvn: "12345670002",
      });

      const [walletId] = await db("wallets").insert({
         user_id: userId,
         balance,
      });

      return { userId, walletId };
   };

   it("withdraws from the authenticated user's wallet and records a transaction", async () => {
      const { userId, walletId } = await createFundedWallet(10000);

      const response = await request(app)
         .post("/wallets/withdraw")
         .set("Authorization", `Bearer ${userId}`)
         .send({ amount: 3000 });

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
         walletId,
         userId,
         newBalance: 7000,
      });

      const wallet = await db("wallets").where({ id: walletId }).first();
      expect(Number(wallet.balance)).toBe(7000);

      const transaction = await db("transactions")
         .where({ wallet_id: walletId, type: "withdrawal" })
         .first();

      expect(transaction).toMatchObject({
         wallet_id: walletId,
         type: "withdrawal",
         amount: 3000,
         status: "successful",
         narration: "Wallet withdrawal",
      });
   });

   it("rejects withdrawal when wallet balance is insufficient", async () => {
      const { userId, walletId } = await createFundedWallet(2000);

      const response = await request(app)
         .post("/wallets/withdraw")
         .set("Authorization", `Bearer ${userId}`)
         .send({ amount: 3000 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
         message: "Insufficient wallet balance",
      });

      const wallet = await db("wallets").where({ id: walletId }).first();
      expect(Number(wallet.balance)).toBe(2000);

      const transactions = await db("transactions").where({ wallet_id: walletId });
      expect(transactions).toHaveLength(0);
   });
});
