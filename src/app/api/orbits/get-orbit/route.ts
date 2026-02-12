import Orbit from "@/src/models/Orbit";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orbitName = searchParams.get("orbitName");

    const orbitData = await Orbit.findOne({ name: orbitName });

    if (!orbitData) {
      return Response.json({ error: "Orbit not found" }, { status: 404 });
    }

    return Response.json({ orbitData });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to get orbit" }, { status: 500 });
  }
};
