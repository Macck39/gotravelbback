import mongoose from "mongoose";

const cabRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  head: {
    type: String,
  },
  phoneno: {
    type: Number,
    required: true,
  },
  pickup: {
    type: String,
    required: true,
  },
  drop: {
    type: String,
    required: true,
  },
  pDate: {
    type: String,
    required: true,
  },
  pTime: {
    type: String,
  },
  distance: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CabRequest = mongoose.model("cabRequest", cabRequestSchema);

export default CabRequest;