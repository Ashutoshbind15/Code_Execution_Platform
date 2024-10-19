import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  success: { type: Boolean },
  tcNum: { type: Number },
  subErrors: [String],
  expected: { type: mongoose.Schema.Types.Mixed },
  output: { type: mongoose.Schema.Types.Mixed },
});

const Submission =
  mongoose?.models?.Submission ||
  mongoose.model("Submission", SubmissionSchema);

export default Submission;
