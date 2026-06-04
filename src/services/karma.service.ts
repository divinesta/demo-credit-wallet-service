import { KarmaCheckInput, KarmaCheckResult } from "../utils/types";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";

type AdjutorKarmaResponse = {
   status: string;
   message: string;
   data?: {
      karma_identity?: string;
      reason?: string | null;
      default_date?: string | null;
   } | null;
};

const buildKarmaUrl = (identity: string): string => {
   const baseUrl = env.adjutor.baseUrl.replace(/\/$/, "");
   return `${baseUrl}/verification/karma/${encodeURIComponent(identity)}`;
};

const getPrimaryIdentity = (input: KarmaCheckInput): string => {
   return input.bvn || input.email || input.phone;
};

export const checkKarmaBlacklist = async (input: KarmaCheckInput): Promise<KarmaCheckResult> => {
   if (!env.adjutor.apiKey) {
      throw new AppError(503, "Karma blacklist service is not configured");
   }

   const identity = getPrimaryIdentity(input);
   const response = await fetch(buildKarmaUrl(identity), {
      method: "GET",
      headers: {
         Authorization: `Bearer ${env.adjutor.apiKey}`,
         Accept: "application/json",
      },
   });

   if (response.status === 404) {
      return {
         isBlacklisted: false,
      };
   }

   if (!response.ok) {
      throw new AppError(503, "Karma blacklist service is unavailable");
   }

   const result = await response.json() as AdjutorKarmaResponse;

   return {
      isBlacklisted: result.status === "success" && Boolean(result.data),
   };
};
