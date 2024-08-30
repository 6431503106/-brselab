import Joi from 'joi';

/* DEFINE CUSTOM MESSAGES */
const customErrorMessages = {
  "any.required": "{{#label}} is required.",
  "string.email": "{{#label}} must be a valid email.",
  "string.pattern.base":
    "{{#label}} must be a valid email address ending with @lamduan.mfu.ac.th or @mfu.ac.th.",
  "string.max": "{{#label}} should not exceed {{#limit}} characters.",
  batchStartEnd: "Starting year should be smaller than ending year.",
};

/* CONTACT US VALIDATION SCHEMA */
const contactUsValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
      "string.pattern.base": "{{#label}} should contain alphabetic characters only.",
    }),
  email: Joi.string()
    .required()
    .email()
    .pattern(/^[\w.%+-]+@(lamduan\.mfu\.ac\.th|mfu\.ac\.th)$/)
    .messages({
      "string.pattern.base": "{{#label}} must be a valid email address ending with @lamduan.mfu.ac.th or @mfu.ac.th.",
    }),
  message: Joi.string().required(),
}).messages(customErrorMessages);

export { contactUsValidationSchema };