import request from "supertest";

import { createApp } from "../../src/app";
import { cleanTestDatabase, closeTestDatabase, createTestUserWithWallet, migrateTestDatabase } from "../helpers/database";

describe("Get my wallet", () => {
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

   it("returns the authenticated user's wallet", async () => {
      const user = await createTestUserWithWallet({ balance: 4500 });

      const response = await request(app)
         .get("/wallets/me")
         .set("Authorization", `Bearer ${user.userId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
         message: "Wallet retrieved successfully",
         data: {
            id: user.walletId,
            userId: user.userId,
            balance: 4500,
         },
      });
   });

   it("returns not found when authenticated user has no wallet", async () => {
      const response = await request(app)
         .get("/wallets/me")
         .set("Authorization", "Bearer 999999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
         message: "Wallet not found",
      });
   });
});
