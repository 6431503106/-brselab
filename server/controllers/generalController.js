import { ADMIN_MAIL } from "../config/index.js";
import ContactUsModel from "../models/contactUs.js";
import sendMail from "../services/email-service.js";
import { contactUsValidationSchema } from "../services/validation-service.js";

 const contactUs = async (req, res, next) => {
  const { 
    name, 
    email, 
    message } 
    = req.body;
  const { error } = contactUsValidationSchema.validate(req.body);

  if (error) {
    return next(new Error(error.details[0].message)); // Provide a detailed error message
  }

  try {
    await ContactUsModel.create(req.body);
    /* SEND MAIL TO ADMIN */
    await sendMail({
      to: ADMIN_MAIL,
      from: email,
      subject: "New Contact Form Submission",
      text: `
      Sender Information : 
      Name : ${name}
      Email : ${email}

      Message Content : 
      ${message}
      `,
    });
    return res.status(200).json({ msg: "Message sent successfully!" });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

 const getMessages = async (req, res, next) => {
  try {
    const messages = await ContactUsModel.find({ status: "unread" });
    return res.status(200).json({ messages });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

 const handleMessages = async (req, res, next) => {
  const { action, replyMessage, _id } = req.body;
  try {
    const document = await ContactUsModel.findById(_id);
    if (!document) {
      return next(new Error("Message not found")); // Custom error message
    }
    if (action === "reply") {
      if (!replyMessage) {
        return next(new Error("Message is required.")); // Custom error message
      }
      /* SEND MAIL */
      await sendMail({
        to: document.email,
        from: ADMIN_MAIL,
        subject: "Reply from MFU SE LAB",
        text: `             
              Reply From Admin: ${replyMessage}
              `,
      });
    }
    document.status = "read";
    await document.save();
    return res.status(200).json({ message: "Processed successfully!" });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

export {
  contactUs,
  getMessages,
  handleMessages,
}