import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },  
    type: {
      type: String,
      enum: ["like", "comment", "follow", "newPost"],
      required: true,
    }, 
    post: { type: Schema.Types.ObjectId, ref: "Post" }, 
    content: { type: String }, 
    isRead: { type: Boolean, default: false }, 
  },
  {
    timestamps: true,  
  }
);
notificationSchema.index({ receiver: 1, isRead: 1 });
const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;
