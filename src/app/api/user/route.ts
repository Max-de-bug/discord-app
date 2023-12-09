import { db } from "@/drizzle/client";
import { profile } from "@/drizzle/schema";
import { eq, lt } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = body;

    const existingUserByEmail = await db.query.profile.findFirst({
      columns: {
        email: email,
      },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this email already exist",
        },
        { status: 409 }
      );
    }
    const existingUserByUsername = await db.query.profile.findFirst({
      columns: {
        username: username,
      },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this username already exist",
        },
        { status: 409 }
      );
    }
    const newUser = db
      .insert(profile)
      .values({
        username: username,
        email: email,
        password: password,
      })
      .returning();
    return NextResponse.json(body);
  } catch (error) {}
}
