import mongoose from "mongoose";

const OrbitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  visibility: {
    type: String,
    enum: ["Public", "Private"],
    default: "Public",
  },
  snapshots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snapshot",
    },
  ],
  storagePath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Orbit || mongoose.model("Orbit", OrbitSchema);
