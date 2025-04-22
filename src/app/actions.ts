// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getData() {
    const DATABASE_URL = process.env.DATABASE_URL || ""; // Set a default value if DATABASE_URL is undefined
    const sql = neon(DATABASE_URL);
    const data = await sql`...`;
    return data;
}