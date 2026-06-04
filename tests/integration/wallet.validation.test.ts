import request from "supertest";

import { createApp } from "../../src/app";

describe("Wallet request validation", () => {
   const app = createApp();

   it("rejects wallet requests without an auth token", async () => {
      const response = await request(app)
         .post("/wallets/fund")
         .send({ amount: 1000 });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
         message: "Unauthorized",
      });
   });

   it("rejects wallet requests with an invalid auth token", async () => {
      const response = await request(app)
         .post("/wallets/fund")
         .set("Authorization", "Bearer abc")
         .send({ amount: 1000 });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
         message: "Unauthorized",
      });
   });

   it("rejects funding with a non-positive amount", async () => {
      const response = await request(app)
         .post("/wallets/fund")
         .set("Authorization", "Bearer 1")
         .send({ amount: 0 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toEqual([
         {
            field: "amount",
            message: "amount must be greater than zero",
         },
      ]);
   });
});
