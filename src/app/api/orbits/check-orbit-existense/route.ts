import { auth } from "@/auth";
import connectDB from "@/src/lib/db";
import Orbit from "@/src/models/Orbit";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orbit = await Orbit.findOne({ owner: session?.user?.id, name });
    if (orbit) {
      return NextResponse.json({ exists: true });
    }
    return NextResponse.json({ exists: false });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
