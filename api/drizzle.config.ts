import { env } from "./src/config/env";
import { defineConfig } from "drizzle-kit";
console.log("env.DATABASE_URL", env.DATABASE_URL)
export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL!
    }
});