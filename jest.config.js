/** @type {import('jest').Config} */
const config = {
   preset: "ts-jest",
   testEnvironment: "node",
   testMatch: ["**/tests/**/*.test.ts"],
   setupFiles: ["<rootDir>/tests/setup-env.ts"],
   clearMocks: true,
   testTimeout: 30000,
   transform: {
      "^.+\\.ts$": [
         "ts-jest",
         {
            tsconfig: {
               isolatedModules: true,
            },
         },
      ],
   },
};

module.exports = config;
