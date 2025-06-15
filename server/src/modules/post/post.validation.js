import joi from 'joi';
import { generalField } from "../../../helpers/generalFields.js"




export const createPostValidationSchema = {
  body: joi.object({
    description: joi.string().min(1).max(500).required().messages({
      'string.empty': 'Post description is required',
      'string.min': 'Description should be at least 1 character long',
      'string.max': 'Description should not exceed 500 characters',
    }),
    location: joi.string().max(100).optional().messages({
      'string.max': 'Location should not exceed 100 characters',
    }),
    tags: joi
      .string()
      .optional()
      .messages({
        'string.pattern.base': 'Tags must be comma-separated words',
      }),
  }),
  // file: generalField.file,
  headers: generalField.headers.required(),
};


export const updatePostValidationSchema = {
  body:joi.object({
      description:joi.string().min(1).max(500).optional(),
      location:joi.string().max(100).optional(),
      tags:joi.string().optional(),
  }) ,
  // file: generalField.file,
  headers: generalField.headers.required()
}  


export const deletePostValidationSchema = {
  headers: generalField.headers.required()
}


export const userPostValidationSchema = {
  headers: generalField.headers.required()
}
