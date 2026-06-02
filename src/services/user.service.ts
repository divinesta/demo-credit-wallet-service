import { CreateUserInput, User } from "../types/types";
import { checkKarmaBlacklist } from "./karma.service";

export const registerUser = async (input: CreateUserInput): Promise<User> => {
   const karmaResult = await checkKarmaBlacklist({
      email: input.email,
      phone: input.phone,
      bvn: input.bvn,
   });

   if (karmaResult.isBlacklisted) {
      throw new Error("User is blacklisted and cannot be onboarded");
   }

   throw new Error("User creation not implemented yet");
};