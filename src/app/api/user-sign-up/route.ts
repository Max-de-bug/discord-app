import { db } from "@/drizzle/client";
import { message, profile } from "@/drizzle/schema";
import { eq, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { userSchema } from "@/app/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = userSchema.parse(body);

    const existingUserByEmail = await db.query.profile.findFirst({
      columns: {
        //@ts-ignore
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
        //@ts-ignore
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
    const newUser = await db
      .insert(profile)
      .values({
        username: username,
        email: email,
        password: hashedPassword,
      })
      .returning({
        id: profile.id,
        username: profile.username,
        email: profile.email,
        imageUrl: profile.imageUrl,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      });

    const jwtToken = jwt.sign({ userData: newUser }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
    return NextResponse.json(
      {
        userCredentials: newUser,
        jwtToken,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
