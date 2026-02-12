import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getUserFromRequest } from "@/src/lib/auth";
import AdmZip from "adm-zip";
import Orbit from "@/src/models/Orbit";
import Snapshot from "@/src/models/Snapshot";
import connectDB from "@/src/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orbit: string }> },
) {
  await connectDB();

  const user = (await getUserFromRequest(req)) as any;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orbitName = (await params).orbit;

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Zip file missing" }, { status: 400 });
  }

  let orbit = await Orbit.findOne({
    name: orbitName,
    owner: user?._id,
  });

  const orbitStoragePath = path.join(
    process.cwd(),
    "data",
    user?.username,
    orbitName,
  );

  if (!orbit) {
    return NextResponse.json(
      {
        error:
          "Orbit not found, try creating it first using kdh create <your-orbit-name> or go to http://localhost:3000/" +
          user?.username +
          "/create-orbit",
      },
      { status: 404 },
    );
  }

  const snapshotCount = await Snapshot.countDocuments({
    orbit: orbit._id,
  });

  const snapshotIndex = snapshotCount + 1;
  const snapshotName = `s${snapshotIndex}`;

  const snapshotStoragePath = path.join(orbitStoragePath, snapshotName);

  fs.mkdirSync(snapshotStoragePath, { recursive: true });

  /* ---------------- EXTRACT ZIP ---------------- */

  const buffer = Buffer.from(await file.arrayBuffer());
  const zip = new AdmZip(buffer);
  zip.extractAllTo(snapshotStoragePath, true);

  /* ---------------- CREATE SNAPSHOT DOC ---------------- */

  const snapshot = await Snapshot.create({
    orbit: orbit._id,
    index: snapshotIndex,
    storagePath: snapshotStoragePath,
  });

  orbit.snapshots.push(snapshot._id);
  await orbit.save();

  /* ---------------- RESPONSE ---------------- */

  const url = `http://localhost:3000/${user.username}/orbits/${orbitName}/${snapshotName}?o=${orbitName}`;

  return NextResponse.json({
    snapshot: snapshotName,
    url,
  });
}
