import connectDB from "@/src/lib/db";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { name, username, email, password } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      usernameSet: true,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User created successfully", data: user },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "User creation failed" },
      { status: 500 },
    );
  }
};
