import { db } from "../database/knex";
import { checkKarmaBlacklist } from "./karma.service";
import { CreateUserInput, User } from "../utils/types";
import { createUser, findUserByEmailPhoneOrBvn } from "../repositories/user.repository";
import { createWalletForUser } from "../repositories/wallet.repository";
import { AppError } from "../utils/app-error";

export const registerUser = async (input: CreateUserInput): Promise<User> => {
   const existingUser = await findUserByEmailPhoneOrBvn({
      email: input.email,
      phone: input.phone,
      bvn: input.bvn,
   });

   if (existingUser) {
      throw new AppError(409, "User with email, phone, or BVN already exists");
   }

   const karmaResult = await checkKarmaBlacklist({
      email: input.email,
      phone: input.phone,
      bvn: input.bvn,
   });

   if (karmaResult.isBlacklisted) {
      throw new AppError(403, "User is blacklisted and cannot be onboarded");
   }

   return db.transaction(async (trx) => {
      const user = await createUser(input, trx);
      await createWalletForUser(user.id, trx);
      return user;
   });
};
