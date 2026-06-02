import { db } from "../database/knex";
import { checkKarmaBlacklist } from "./karma.service";
import { CreateUserInput, User } from "../utils/types";
import { createUser } from "../repositories/user.repository";
import { createWalletForUser } from "../repositories/wallet.repository";

export const registerUser = async (input: CreateUserInput): Promise<User> => {
   const karmaResult = await checkKarmaBlacklist({
      email: input.email,
      phone: input.phone,
      bvn: input.bvn,
   });

   if (karmaResult.isBlacklisted) {
      throw new Error("User is blacklisted and cannot be onboarded");
   }

   return db.transaction(async (trx) => {
      const user = await createUser(input, trx);
      await createWalletForUser(user.id, trx);
      return user;
   });
};
