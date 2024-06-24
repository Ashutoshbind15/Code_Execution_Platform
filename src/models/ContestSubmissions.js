import mongoose from "mongoose";

const ContestSubmissionsSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assuming you have a User model
  submissions: [Number],
});

const ContestSubmissions =
  mongoose?.models?.ContestSubmissions ||
  mongoose.model("ContestSubmissions", ContestSubmissionsSchema);

export default ContestSubmissions;
