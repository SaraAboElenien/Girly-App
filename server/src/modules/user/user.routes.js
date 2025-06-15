import express from "express";
import * as UC from "./user.controller.js";
import { auth } from "../../../middlewares/auth.js";
import { validation } from "../../../middlewares/validation.js";
import * as UV from "./user.validation.js";
const router = express.Router();
import { systemRoles } from "../../../helpers/systemRoles.js";
import { uploadImage } from "../../../helpers/multerLocal.js";
import { handleCloudinaryUpload } from "../../../helpers/multerLocal.js";

router.post("/signup", validation(UV.signupValidationSchema), UC.signUp);
router.post("/signin", validation(UV.signinValidationSchema), UC.signIn);
router.post("/signout", auth(systemRoles.user), UC.signOut);
router.get("/list", UC.listUsers);
router.get("/userByID/:id", auth(systemRoles.user), UC.userByID);
router.get("/profile", auth(systemRoles.user), UC.readProfile);
router.patch(
  "/updateProfile",
  auth(systemRoles.user),
  uploadImage("profileImage"),
  handleCloudinaryUpload,
  UC.updateAccount
);

export default router;