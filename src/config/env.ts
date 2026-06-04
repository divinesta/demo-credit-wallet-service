export const env = {
   nodeEnv: process.env.NODE_ENV ?? "development",
   port: Number(process.env.PORT ?? 3000),
   db: {
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? "root",
      password: process.env.DB_PASSWORD ?? "",
      name:
         process.env.NODE_ENV === "test"
            ? process.env.TEST_DB_NAME ?? "demo_credit_wallet_test"
            : process.env.DB_NAME ?? "demo_credit_wallet",
   },
   adjutor: {
      baseUrl: process.env.ADJUTOR_BASE_URL ?? "https://adjutor.lendsqr.com/v2",
      apiKey: process.env.ADJUTOR_API_KEY ?? "",
   },
};
