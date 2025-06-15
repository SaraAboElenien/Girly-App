import joi from 'joi';  
import { generalField } from '../../../helpers/generalFields.js'

export const signupValidationSchema = {
 body: joi.object({
    firstName: joi.string().min(3).max(30).required(),
    lastName: joi.string().min(3).max(30).required(),
    password: joi.string().min(8).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
    email: joi.string().email().required(),
}),
};

export const signinValidationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .min(8).required(),
});

export const updatePasswordSchema = joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().min(6).required(),
});
  