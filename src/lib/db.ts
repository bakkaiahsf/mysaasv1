import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as nextAuthSchema from "./nextauth-schema";

const connectionString = process.env.POSTGRES_URL as string;

if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

// Combined schema for both NextAuth and existing app tables
const combinedSchema = { ...schema, ...nextAuthSchema };

const client = postgres(connectionString);
export const db = drizzle(client, { schema: combinedSchema });
