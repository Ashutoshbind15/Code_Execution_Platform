import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  testcases: [
    {
      input: String,
      output: String,
    },
  ],
  exampleTestcases: [
    {
      input: String,
      output: String,
    },
  ],
  inputDescription: { type: String },
  outputDescription: { type: String },
  difficulty: { type: String },
  contributedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  visibility: { type: Boolean, default: true },
});

const Problem =
  mongoose?.models?.Problem || mongoose.model("Problem", problemSchema);

export default Problem;
