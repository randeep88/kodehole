import { auth } from "@/auth";
import Orbit from "@/src/models/Orbit";
import Snapshot from "@/src/models/Snapshot";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const orbitName = searchParams.get("orbitName");

    const session = (await auth()) as any;

    console.log(session);

    if (!session.user.id) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    const orbit = await Orbit.findOne({
      name: orbitName,
      owner: session.user.id,
    });

    if (!orbit) {
      return NextResponse.json({ error: "Orbit not found" });
    }

    const snapshots = await Snapshot.find({
      orbit: orbit._id,
    }).populate("orbit", "name description visibility");

    return NextResponse.json(snapshots);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch snapshots" });
  }
}
