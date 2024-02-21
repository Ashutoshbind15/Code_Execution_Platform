import mongoose from "mongoose";

const problemSubmissionsSchema = new mongoose.Schema({
  pid: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assuming you have a User model
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
});

const ProblemSubmissions =
  mongoose?.models?.ProblemSubmissions ||
  mongoose.model("ProblemSubmissions", problemSubmissionsSchema);

export default ProblemSubmissions;
