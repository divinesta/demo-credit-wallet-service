import { createUserSchema, fundWalletSchema, transferWalletSchema } from "../../src/utils/validation";

describe("Validation schemas", () => {
   it("accepts a valid user creation payload", () => {
      const result = createUserSchema.safeParse({
         firstName: "Divine",
         lastName: "Test",
         email: "divine@example.com",
         phone: "08010000000",
         bvn: "12345678901",
      });

      expect(result.success).toBe(true);
   });

   it("rejects invalid user creation payloads", () => {
      const result = createUserSchema.safeParse({
         firstName: "",
         lastName: "Test",
         email: "invalid-email",
         phone: "",
         bvn: "123",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
         expect(result.error.issues.map((issue) => issue.message)).toEqual(
            expect.arrayContaining([
               "firstName is required",
               "email must be valid",
               "phone is required",
               "bvn must be 11 digits",
            ])
         );
      }
   });

   it("requires wallet funding amount to be greater than zero", () => {
      const result = fundWalletSchema.safeParse({ amount: 0 });

      expect(result.success).toBe(false);

      if (!result.success) {
         expect(result.error.issues[0]?.message).toBe("amount must be greater than zero");
      }
   });

   it("requires transfer receiver id and amount to be positive", () => {
      const result = transferWalletSchema.safeParse({
         receiverUserId: 0,
         amount: -100,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
         expect(result.error.issues.map((issue) => issue.message)).toEqual(
            expect.arrayContaining([
               "Invalid user id",
               "amount must be greater than zero",
            ])
         );
      }
   });
});
