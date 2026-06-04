import request from "supertest";

import { createApp } from "../../src/app";
import { db } from "../../src/database/knex";
import {
   cleanTestDatabase,
   closeTestDatabase,
   createTestUserWithWallet,
   migrateTestDatabase,
} from "../helpers/database";

describe("Wallet transfer", () => {
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

   it("transfers funds between two wallets and records debit and credit transactions", async () => {
      const sender = await createTestUserWithWallet({
         email: "sender@example.com",
         phone: "08030000001",
         bvn: "12345670003",
         balance: 10000,
      });
      const receiver = await createTestUserWithWallet({
         email: "receiver@example.com",
         phone: "08030000002",
         bvn: "12345670004",
         balance: 2000,
      });

      const response = await request(app)
         .post("/wallets/transfer")
         .set("Authorization", `Bearer ${sender.userId}`)
         .send({ receiverUserId: receiver.userId, amount: 3000 });

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
         senderWalletId: sender.walletId,
         receiverWalletId: receiver.walletId,
         amount: 3000,
         senderNewBalance: 7000,
      });

      const senderWallet = await db("wallets").where({ id: sender.walletId }).first();
      const receiverWallet = await db("wallets").where({ id: receiver.walletId }).first();

      expect(Number(senderWallet.balance)).toBe(7000);
      expect(Number(receiverWallet.balance)).toBe(5000);

      const transactions = await db("transactions").orderBy("id", "asc");

      expect(transactions).toHaveLength(2);
      expect(transactions[0]).toMatchObject({
         wallet_id: sender.walletId,
         related_wallet_id: receiver.walletId,
         type: "transfer_debit",
         amount: 3000,
         status: "successful",
      });
      expect(transactions[1]).toMatchObject({
         wallet_id: receiver.walletId,
         related_wallet_id: sender.walletId,
         type: "transfer_credit",
         amount: 3000,
         status: "successful",
      });
   });

   it("rejects transfer to the same wallet", async () => {
      const user = await createTestUserWithWallet({ balance: 10000 });

      const response = await request(app)
         .post("/wallets/transfer")
         .set("Authorization", `Bearer ${user.userId}`)
         .send({ receiverUserId: user.userId, amount: 1000 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
         message: "Cannot transfer to the same wallet",
      });

      const wallet = await db("wallets").where({ id: user.walletId }).first();
      expect(Number(wallet.balance)).toBe(10000);
      expect(await db("transactions")).toHaveLength(0);
   });

   it("rejects transfer when sender balance is insufficient", async () => {
      const sender = await createTestUserWithWallet({ balance: 1000 });
      const receiver = await createTestUserWithWallet({ balance: 0 });

      const response = await request(app)
         .post("/wallets/transfer")
         .set("Authorization", `Bearer ${sender.userId}`)
         .send({ receiverUserId: receiver.userId, amount: 3000 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
         message: "Insufficient wallet balance",
      });

      const senderWallet = await db("wallets").where({ id: sender.walletId }).first();
      const receiverWallet = await db("wallets").where({ id: receiver.walletId }).first();

      expect(Number(senderWallet.balance)).toBe(1000);
      expect(Number(receiverWallet.balance)).toBe(0);
      expect(await db("transactions")).toHaveLength(0);
   });

   it("rejects transfer when receiver wallet does not exist", async () => {
      const sender = await createTestUserWithWallet({ balance: 10000 });

      const response = await request(app)
         .post("/wallets/transfer")
         .set("Authorization", `Bearer ${sender.userId}`)
         .send({ receiverUserId: 999999, amount: 3000 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
         message: "Receiver wallet not found",
      });

      const senderWallet = await db("wallets").where({ id: sender.walletId }).first();
      expect(Number(senderWallet.balance)).toBe(10000);
      expect(await db("transactions")).toHaveLength(0);
   });
});
