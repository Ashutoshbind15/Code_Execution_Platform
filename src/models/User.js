import mongoose from "mongoose";

const UserSchema = new Schema({
  username: String,
  email: String,
  role: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
