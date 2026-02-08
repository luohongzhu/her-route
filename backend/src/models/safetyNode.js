import mongoose from "mongoose";

const safetyNodeSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  geohash: {
    type: String,
    index: true, // critical
  },
  lampCount: Number,
  lightingScore: Number,
  userVoteSum: {
    type: Number,
    default: 0
  },
  userVoteCount: {
    type: Number,
    default: 0
  },
  safetyScore: Number
});

export default mongoose.model("SafetyNode", safetyNodeSchema);