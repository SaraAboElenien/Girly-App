import express from "express";
import * as PC from "./post.controller.js";
import * as PV from "./post.validation.js";
import { validation } from "../../../middlewares/validation.js";
import { auth } from "../../../middlewares/auth.js";
import { systemRoles } from "../../../helpers/systemRoles.js";
import { handleCloudinaryUpload } from "../../../helpers/multerLocal.js";
import { uploadImage } from "../../../helpers/multerLocal.js";
const router = express.Router();
// create post
router.post(
  "/create-post",
  auth(systemRoles.user),
  uploadImage('postImage'),
  handleCloudinaryUpload,
  validation(PV.createPostValidationSchema),
  PC.createPost
);
// update post
router.put(
  "/:id",
  auth(systemRoles.user),
  uploadImage('postImage'),
  handleCloudinaryUpload,
  validation(PV.updatePostValidationSchema),
  PC.updatePost
);

// delete post
router.delete(
  "/:id",
  auth(systemRoles.user),
  validation(PV.deletePostValidationSchema),
  PC.deletePost
);

// user's posts
router.get(
  "/user-post/:userId",
  validation(PV.userPostValidationSchema),
  auth(systemRoles.user),
  PC.getUserPosts
);

// get posts
router.get("/recent-post", auth(systemRoles.user), PC.getRecentPosts);
router.put("/:id/like", auth(systemRoles.user), PC.likePost);


export default router;
  