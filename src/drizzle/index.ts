import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as AuthSchema from "./schema/auth";

const databaseURL = process.env["DATABASE_URL"];
if (!databaseURL) throw new Error("Enviromental database Url not");

const connection = postgres(databaseURL);

export const adapterDB = drizzle(connection);
export const db = drizzle(connection, {
  schema: AuthSchema,
});

export type DbClient = typeof db;
