import { auth } from "@/auth";
import User from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { bio } = await req.json();

    if (!bio) {
      return NextResponse.json({ message: "Bio is required" }, { status: 400 });
    }

    const session = (await auth()) as any;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOneAndUpdate(
      { username: session?.user?.username },
      { bio },
      { new: true },
    );

    return NextResponse.json({ message: "Bio updated successfully", user });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
};
