import { db } from "@/drizzle/client";
import { message, profile } from "@/drizzle/schema";
import { eq, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

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

    const hashedPassword = await hash(password, 10);
    const newUser = db
      .insert(profile)
      .values({
        username: username,
        email: email,
        password: hashedPassword,
      })
      .returning();
    return NextResponse.json(
      {
        user: newUser,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {}
}
