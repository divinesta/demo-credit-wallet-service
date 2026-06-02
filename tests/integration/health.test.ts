import request from 'supertest';

import  { createApp }  from '../../src/app';

describe("Health endpoint", () => {
   it("returns service health status", async () => {
      const app = createApp();

      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
         status: "ok",
         service: "Credit Wallet Service",
      });
   });
});