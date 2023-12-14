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
    const { email, password } = userSchema.parse(body);

    const existingUser = await db.query.profile.findFirst({
      columns: {
        //@ts-ignore
        email: email,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 403 }
      );
    }

    const jwtToken = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "30d",
      }
    );

    // const jwtToken = jwt.sign({ userData: newUser }, process.env.JWT_SECRET!, {
    //   expiresIn: "30d",
    // });
    return NextResponse.json(
      {
        userCredentials: existingUser,
        jwtToken,
        message: "User  successfully authenticated",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
