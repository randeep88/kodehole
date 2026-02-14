import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/src/lib/auth";
import connectDB from "@/src/lib/db";
import AdmZip from "adm-zip";
import Orbit from "@/src/models/Orbit";
import Snapshot from "@/src/models/Snapshot";
import { uploadToR2 } from "@/src/lib/r2-upload";

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

  const orbit = await Orbit.findOne({
    name: orbitName,
    owner: user._id,
  });

  if (!orbit) {
    return NextResponse.json(
      {
        error: "Orbit not found. Use: kdh create <orbit-name>",
      },
      { status: 404 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Zip file missing" }, { status: 400 });
  }

  const snapshotCount = await Snapshot.countDocuments({
    orbit: orbit._id,
  });

  const snapshotIndex = snapshotCount + 1;
  const snapshotName = `s${snapshotIndex}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const zip = new AdmZip(buffer);

  const entries = zip.getEntries();

  for (const entry of entries) {
    if (!entry.isDirectory) {
      const fileBuffer = entry.getData();

      const key = `${user.username}/${orbitName}/${snapshotName}/${entry.entryName}`;

      await uploadToR2(key, fileBuffer);
    }
  }

  const snapshot = await Snapshot.create({
    orbit: orbit._id,
    index: snapshotIndex,
    storagePath: `${user.username}/${orbitName}/${snapshotName}`,
    createdAt: new Date(),
  });

  orbit.snapshots.push(snapshot._id);
  orbit.updatedAt = new Date();
  await orbit.save();

  const url = `/${user.username}/orbits/${orbitName}/${snapshotName}`;

  return NextResponse.json({
    snapshot: snapshotName,
    url,
  });
}
