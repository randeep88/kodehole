import connectDB from "@/src/lib/db";
import User from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    await connectDB();
    const { username, email } = await req.json();
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    console.log(username, email);
    const user = await User.findOneAndUpdate(
      { email },
      { username, usernameSet: true },
      { new: true },
    );
    return NextResponse.json(
      { message: "Username updated successfully", user },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
};
