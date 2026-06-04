import request from "supertest";

import { createApp } from "../../src/app";
import { db } from "../../src/database/knex";
import { cleanTestDatabase, closeTestDatabase, migrateTestDatabase } from "../helpers/database";

describe("Wallet funding", () => {
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

   it("funds the authenticated user's wallet and records a transaction", async () => {
      const [userId] = await db("users").insert({
         first_name: "Divine",
         last_name: "Test",
         email: "funding-test@example.com",
         phone: "08010000001",
         bvn: "12345670001",
      });

      const [walletId] = await db("wallets").insert({
         user_id: userId,
         balance: 0,
      });

      const response = await request(app)
         .post("/wallets/fund")
         .set("Authorization", `Bearer ${userId}`)
         .send({ amount: 10000 });

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
         walletId,
         userId,
         newBalance: 10000,
      });

      const wallet = await db("wallets").where({ id: walletId }).first();
      expect(Number(wallet.balance)).toBe(10000);

      const transaction = await db("transactions")
         .where({ wallet_id: walletId, type: "funding" })
         .first();

      expect(transaction).toMatchObject({
         wallet_id: walletId,
         type: "funding",
         amount: 10000,
         status: "successful",
         narration: "Wallet funding",
      });
   });
});
