import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
  },
  password: {
    type: String,
    required: function () {
      return this.provider === "credentials";
    },
  },
  provider: {
    type: String,
    enum: ["credentials", "google", "github"],
    default: "credentials",
  },
  usernameSet: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
