import request from "supertest";

import { createApp } from "../../src/app";
import { db } from "../../src/database/knex";
import { cleanTestDatabase, closeTestDatabase, createTestUserWithWallet, migrateTestDatabase } from "../helpers/database";

describe("User creation", () => {
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

   it("rejects invalid user creation payloads before checking Karma", async () => {
      const response = await request(app)
         .post("/users")
         .send({
            firstName: "",
            lastName: "Test",
            email: "not-an-email",
            phone: "",
            bvn: "123",
         });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toEqual(
         expect.arrayContaining([
            {
               field: "firstName",
               message: "firstName is required",
            },
            {
               field: "email",
               message: "email must be valid",
            },
            {
               field: "phone",
               message: "phone is required",
            },
            {
               field: "bvn",
               message: "bvn must be 11 digits",
            },
         ])
      );
   });

   it("blocks onboarding when Karma is not configured", async () => {
      const originalApiKey = process.env.ADJUTOR_API_KEY;
      process.env.ADJUTOR_API_KEY = "";

      const response = await request(app)
         .post("/users")
         .send({
            firstName: "Divine",
            lastName: "Test",
            email: "karma-config-test@example.com",
            phone: "08040000001",
            bvn: "12345670005",
         });

      process.env.ADJUTOR_API_KEY = originalApiKey;

      expect(response.status).toBe(503);
      expect(response.body).toEqual({
         message: "Karma blacklist service is not configured",
      });
   });

   it("rejects duplicate email, phone, or BVN before onboarding", async () => {
      await createTestUserWithWallet({
         email: "duplicate@example.com",
         phone: "08050000001",
         bvn: "12345670006",
      });

      const response = await request(app)
         .post("/users")
         .send({
            firstName: "Duplicate",
            lastName: "User",
            email: "duplicate@example.com",
            phone: "08050000002",
            bvn: "12345670007",
         });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
         message: "User with email, phone, or BVN already exists",
      });
   });
});
