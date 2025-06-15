
import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    location: { type: String },
    image: {
      secure_url: String,
      public_id: String,
    },
    customId: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", postSchema);

export default postModel;