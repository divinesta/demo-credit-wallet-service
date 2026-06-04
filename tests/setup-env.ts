import dotenv from "dotenv";

dotenv.config({ path: ".env.test", quiet: true });
dotenv.config({ quiet: true });

process.env.NODE_ENV = "test";
