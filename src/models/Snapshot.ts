import mongoose from "mongoose";

const SnapshotSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
  },
  orbit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orbit",
    required: true,
  },
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

export default mongoose.models.Snapshot ||
  mongoose.model("Snapshot", SnapshotSchema);
