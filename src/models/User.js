import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: String,
  problemTries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProblemSubmissions",
    },
  ],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
