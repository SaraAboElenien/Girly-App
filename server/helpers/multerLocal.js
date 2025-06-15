import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';

const multerFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

export const uploadImage = (fieldName) => {
  return multer({
    storage: multer.memoryStorage(),
    fileFilter: multerFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }).single(fieldName);
};

export const handleCloudinaryUpload = async (req, res, next) => {
  if (!req.file) {
    // Skip image processing if no file is provided
    req.uploadedImage = null;
    return next();
  }

  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const folderName = req.file.fieldname === 'profileImage' 
      ? 'SocialMedia/Users/ProfileImages'
      : req.file.fieldname === 'postImage'
      ? 'SocialMedia/Posts'
      : 'SocialMedia/Other';

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: folderName
    });

    req.uploadedImage = {
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    };

    next();
  } catch (error) {
    next(new Error(`Upload failed: ${error.message}`));
  }
};