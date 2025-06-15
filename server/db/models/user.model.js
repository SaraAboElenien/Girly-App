import mongoose, { Types } from "mongoose";
import { systemRoles } from "../../helpers/systemRoles.js";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      secure_url: {
        type: String,
        default:
          "https://res.cloudinary.com/deosyyprn/image/upload/v1738067708/profile-placeholder_oivia0.svg"
      },
      public_id: {
        type: String,
        default: "profile-placeholder_oivia0"
      },
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: systemRoles.user,
    },
    bio: {
      type: String,
      default: `🌟 Dreamer | Creator | Doer
📍 Living life one adventure at a time
💡 Turning ideas into reality | Lover of tech, coffee, and great conversations ☕💻
✨ Sharing moments, insights, and a sprinkle of humor 😄
📩 Let’s connect & grow together`,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;