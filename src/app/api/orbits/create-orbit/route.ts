import { auth } from "@/auth";
import { getUserFromRequest } from "@/src/lib/auth";
import connectDB from "@/src/lib/db";
import { getOrbitPath } from "@/src/lib/storage";
import Orbit from "@/src/models/Orbit";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { name, description, visibility } = await req.json();

    const session = (await auth()) as any;
    const cliUser = await getUserFromRequest(req);

    const user = session?.user || cliUser;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingOrbit = await Orbit.findOne({
      owner: user?.id,
      name,
    });

    if (existingOrbit) {
      return NextResponse.json(
        { error: "Orbit already exists" },
        { status: 400 },
      );
    }

    const orbitPath = getOrbitPath(user?.username, name);

    const orbit = await Orbit.create({
      owner: user?.id,
      name,
      description,
      visibility,
      storagePath: orbitPath,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json(orbit);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
