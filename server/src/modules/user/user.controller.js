import bcryptjs from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken';
import userModel from '../../../db/models/user.model.js';
// import { sendEmail } from '../../../helpers/sendEmail.js';
import jwt from 'jsonwebtoken';
// import { nanoid } from 'nanoid';
import { asyncHandler } from '../../../helpers/globleErrorHandling.js';
import { AppError } from '../../../helpers/classError.js';
import path from 'path'
import fs from 'fs';
// import notificationModel from '../../../db/models/notification.model.js';
import cloudinary from '../../../helpers/cloudinary.js';
const { compare, hash } = bcryptjs;
const { sign } = jsonwebtoken;


//========== Sign up  ==========//
export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const userExist = await userModel.findOne({ email: email.toLowerCase() });
  if (userExist) {
    return res.status(409).json({
      message: "This email is already registered! Please use another email.",
    });
  }

  const hashedPassword = await hash(password, parseInt(process.env.saltRounds));

  const newUser = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (!newUser) {
    return next(new AppError("Failed to register!", 500));
  }

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email, role: newUser.role },
    process.env.JWT_SECRET
  );

  newUser.loggedIn = true;
  await newUser.save();

  res.status(201).json({
    message: "Congrats! You're registered",
    token,
    user: {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    }
  });
});




//========== Sign in  ==========//
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );

  user.loggedIn = true;
  await user.save();

  res.json({
    message: "Signin successful",
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name || `${user.firstName} ${user.lastName}`,
    },
  });
});




//=========== Sign out ============//
export const signOut = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.loggedIn = false;
  await user.save();

  res.status(200).json({
    message: "You have successfully signed out",
    user: {
      id: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    },
  });
});





//=========== List all users with count ============//
export const listUsers = asyncHandler(async (req, res, next) => {
    const users = await userModel.find({}, 'firstName lastName username email profileImage createdAt updatedAt');
    const userCount = await userModel.countDocuments();

    res.status(200).json({
        message: 'User list retrieved successfully',
        userCount,
        users
    });
});





//=========== Get User By ID ============//
// This is the user Profile (other users)//
export const userByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log('Received ID:', id); 
    const user = await userModel.findById(id).select('-password');
    if (!user) {
        return next(new AppError("Could not retrieve user!", 400)); 
    }
    res.status(200).json(user); 
    console.log('User found:', user);
});


   


//=========== Read User Details (views my own info) ============//
export const readProfile = (req, res) => {
    const { user } = req; 
    const { password,confirmed,loggedIn,role, ...userDetails } = user.toObject(); 
    res.status(200).json({ message: 'User details retrieved successfully', user: userDetails });
};



//=========== Update User Profile ============//
export const updateAccount = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { firstName, lastName, bio } = req.body;

  // Prepare fields to update
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (bio) user.bio = bio;

  // Handle profile image update
  if (req.uploadedImage) {
    try {
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }

      const { secure_url, public_id } = req.uploadedImage;
      user.profileImage = { secure_url, public_id };
    } catch (error) {
      return next(new AppError(`Error updating profile image: ${error.message}`, 500));
    }
  }

  // Save all updates in one go
  const updatedUser = await user.save();
  if (!updatedUser) {
    return next(new AppError("Failed to update user profile", 500));
  }

  const { password, loggedIn, role, ...userDetails } = updatedUser.toObject();

  res.status(200).json({
    message: 'Your account updated successfully <3',
    user: userDetails,
  });
});




  






// =========== Profile ============//
// export const getProfile = asyncHandler(async (req, res, next) => {
//     const user = await userModel.findById(req.user.id).select('-password');  
//     if (!user) {
//         return next(new AppError("Could not retrieve user profile!", 400));
//     }
//     res.status(200).json({ message: 'User profile fetched successfully', user });
// });
