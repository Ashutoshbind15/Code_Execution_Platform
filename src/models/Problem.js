import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  testcases: [
    {
      inputs: String,
      output: String,
    },
  ],
  inputDescription: { type: String },
  outputDescription: { type: String },
  difficulty: { type: String },
});

const Problem =
  mongoose?.models?.Problem || mongoose.model("Problem", problemSchema);

export default Problem;
