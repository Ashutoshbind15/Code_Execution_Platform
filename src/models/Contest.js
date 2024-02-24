import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  div: { type: Number },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  leaderboard: [
    {
      uid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      points: { type: Number },
      time: { type: Date },
    },
  ],
});

const Contest =
  mongoose?.models?.Contest || mongoose.model("Contest", ContestSchema);

export default Contest;
