import Joi from 'joi';

const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[\p{L}\s']*$/u)
      .max(100)
      .required()
      .messages({
        'string.pattern.base': '"Name" must not contain numbers or special characters.',
        'string.max': '"Name" must have a maximum length of {#limit} characters.',
        'any.required': '"Name" is required.',
      }),
    gmail: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,50}$/)
      .strict()
      .messages({
        'string.pattern.base':
          '"Password" must contain at least one uppercase letter, one lowercase letter, and one digit.',
      }),
    // repeatPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    //   'any.only': '"Repeat Password" must match "Password".',
    //   'any.required': '"Repeat Password" is required.',
    // }),
    gender: Joi.string().valid('MALE', 'FEMALE').required(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]+$/)
      .min(10)
      .max(10)
      .required(),
    address: Joi.string()
    .messages({
      'any.required': `address is a required field`
    }),
    dateOfBirth: Joi.date()
      .required()
      .messages({
        'date.base': '"Date of Birth" must be a valid date.',
        'date.max': '"Date of Birth" must not be in the future.',
        'any.required': '"Date of Birth" is required.'
      })
  });
  export {schema}