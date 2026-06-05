import { checkKarmaBlacklist } from "../../src/services/karma.service";
import { AppError } from "../../src/utils/app-error";

describe("Karma service", () => {
   const originalApiKey = process.env.ADJUTOR_API_KEY;
   const fetchMock = jest.fn();

   beforeEach(() => {
      process.env.ADJUTOR_API_KEY = "test-api-key";
      global.fetch = fetchMock;
      fetchMock.mockReset();
   });

   afterAll(() => {
      process.env.ADJUTOR_API_KEY = originalApiKey;
   });

   it("throws a service error when the API key is missing", async () => {
      process.env.ADJUTOR_API_KEY = "";

      await expect(
         checkKarmaBlacklist({
            email: "clean@example.com",
            phone: "08010000000",
            bvn: "12345678901",
         })
      ).rejects.toMatchObject({
         statusCode: 503,
         message: "Karma blacklist service is not configured",
      });

      expect(fetchMock).not.toHaveBeenCalled();
   });

   it("returns not blacklisted when Adjutor returns 404", async () => {
      fetchMock.mockResolvedValue({
         status: 404,
         ok: false,
      });

      const result = await checkKarmaBlacklist({
         email: "clean@example.com",
         phone: "08010000000",
         bvn: "12345678901",
      });

      expect(result).toEqual({
         isBlacklisted: false,
      });
   });

   it("returns blacklisted when Adjutor returns a successful Karma record", async () => {
      fetchMock.mockResolvedValue({
         status: 200,
         ok: true,
         json: async () => ({
            status: "success",
            message: "Successful",
            data: {
               karma_identity: "12345678901",
               reason: "Defaulted loan",
               default_date: "2024-01-01",
            },
         }),
      });

      const result = await checkKarmaBlacklist({
         email: "listed@example.com",
         phone: "08010000000",
         bvn: "12345678901",
      });

      expect(result).toEqual({
         isBlacklisted: true,
      });
   });

   it("throws a service error when Adjutor is unavailable", async () => {
      fetchMock.mockRejectedValue(new Error("network error"));

      const result = checkKarmaBlacklist({
         email: "clean@example.com",
         phone: "08010000000",
         bvn: "12345678901",
      });

      await expect(result).rejects.toBeInstanceOf(AppError);
      await expect(result).rejects.toMatchObject({
         statusCode: 503,
         message: "Karma blacklist service is unavailable",
      });
   });
});
