import { z } from "zod";

export const createUserSchema = z.object({
   firstName: z.string().trim().min(1, "firstName is required"),
   lastName: z.string().trim().min(1, "lastName is required"),
   email: z.email("email must be valid"),
   phone: z.string().trim().min(1, "phone is required"),
   bvn: z
      .string()
      .trim()
      .regex(/^\d{11}$/, "bvn must be 11 digits"),
});

export const fundWalletSchema = z.object({
   amount: z.number().positive("amount must be greater than zero"),
});

export const withdrawWalletSchema = fundWalletSchema;