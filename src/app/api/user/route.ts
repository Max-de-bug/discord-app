import { db } from "@/drizzle/client";
import { profile } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = body;

    const existingUserByEmail = await db.select().from(profile);

    return NextResponse.json(body);
  } catch (error) {}
}
