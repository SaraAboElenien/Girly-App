import postModel from "../../../db/models/post.model.js";
import { asyncHandler } from "../../../helpers/globleErrorHandling.js";
import { AppError } from "../../../helpers/classError.js";
import userModel from "../../../db/models/user.model.js";
import { ApiFeatures } from "../../../helpers/ApiFeatures.js";
import notificationModel from "../../../db/models/notification.model.js";
import { nanoid } from "nanoid";
import cloudinary from '../../../helpers/cloudinary.js';


export const createPost = asyncHandler(async (req, res, next) => {
  const { description, tags, location } = req.body;
  const userId = req.user._id;

  if (!description) {
    return next(new AppError("Post description is required", 400));
  }

  if (!req.uploadedImage) {
    console.log("No image uploaded");
    return next(new AppError("Image upload failed", 400));
  }
console.log("Image uploaded:", req.uploadedImage);

  const { secure_url, public_id } = req.uploadedImage;
  const customId = nanoid(5);

  try {
    const newPost = await postModel.create({
      userId,
      description,
      image: { secure_url, public_id },
      customId, 
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      location: location || "",
    });

    if (!newPost) {
      return next(new AppError("Failed to create post", 500));
    }

    const user = await userModel.findById(userId).select("followers");
    if (user?.followers?.length > 0) {
      const notifications = user.followers.map((followerId) => ({
        receiver: followerId,
        sender: userId,
        type: "newPost",
        content: `has posted: ${description.slice(0, 30)}...`,
        postId: newPost._id,
      }));

      notificationModel.insertMany(notifications).catch((error) => {
        console.error("Error creating notifications:", error.message);
      });
    }

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    next(new AppError(`Error creating post: ${error.message}`, 500));
  }
});



//**** Update Post ****//
export const updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { description, location, tags } = req.body;

  const post = await postModel.findById(id);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (description) post.description = description;
  if (location) post.location = location;
  if (tags) post.tags = tags.split(",").map((tag) => tag.trim());

  if (req.uploadedImage) {
    try {
      if (post.image?.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }

      const { secure_url, public_id } = req.uploadedImage;
      post.image = { secure_url, public_id };
    } catch (error) {
      return next(new AppError(`Error updating image: ${error.message}`, 500));
    }
  }

  const updatedPost = await post.save();
  if (!updatedPost) {
    return next(new AppError("Failed to update post", 500));
  }

  res.status(200).json({
    message: "Post updated successfully",
    post: updatedPost,
  });
});






// post's search, filter, sort, pagination, and select
export const getRecentPosts = asyncHandler(async (req, res, next) => {
  let mongooseQuery = postModel.find().populate({
    path: "userId",
    select: "firstName lastName profileImage",
  });

  const apiFeatures = new ApiFeatures(mongooseQuery, req.query)
    .sort("-createdAt")
    .pagination()
    .search()
    .filter()
    .select();

  const posts = await apiFeatures.mongooseQuery;
  if (!posts || posts.length === 0) {
    return next(new AppError("No posts found", 404));
  }

  res.status(200).json({
    message: "Posts fetched successfully",
    documents: posts,
  });
});





/** Like or unlike a post **/
export const likePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await postModel
    .findById(id)
    .populate("userId", "firstName lastName");

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Ensure likes is an array
  if (!Array.isArray(post.likes)) {
    post.likes = [];
  }

  const isLiked = post.likes.some(like => like.toString() === userId.toString());

  if (isLiked) {
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
  } else {
    post.likes.push(userId);

    if (post.userId._id.toString() !== userId.toString()) {
      const existingNotification = await notificationModel.findOne({
        receiver: post.userId._id,
        sender: userId,
        type: "like",
        post: post._id,
      });

      if (!existingNotification) {
        await notificationModel.create({
          receiver: post.userId._id,
          sender: userId,
          type: "like",
          post: post._id,
          content: `liked your post.`,
        });
      }
    }
  }

  await post.save();

  res.status(200).json({
    message: isLiked ? "Post unliked" : "Post liked",
    likesCount: post.likes.length,
    isLiked: !isLiked,
    likes: post.likes.map(like => like.toString())
  });
});














//**Posts by a Specific User**//
export const getUserPosts = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  const posts = await postModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "userId",
      select: "firstName lastName profileImage",
    });

  if (posts.length === 0) {
    return next(new AppError("No posts found for this user", 404));
  }

  res.status(200).json({
    message: "User posts fetched successfully",
    posts,
  });
});









//*** Delete a post***/
export const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await postModel.findById(id);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to delete this post", 403));
  }

  await postModel.deleteOne({ _id: id });

  res.status(200).json({
    message: "Post deleted successfully",
    postId: post._id,
  });
});