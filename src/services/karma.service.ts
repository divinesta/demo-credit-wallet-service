import { KarmaCheckInput, KarmaCheckResult } from "../types/types";

export const checkKarmaBlacklist = async (
   input: KarmaCheckInput
): Promise<KarmaCheckResult> => {
   console.log("Karma check input:", input);

   return {
      isBlacklisted: false,
   };
}