/*import cron from "node-cron";
import nodemailer from "nodemailer";
import Order from "../models/orderModel.js";
import dotenv from "dotenv";


dotenv.config();

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or any other email service provider
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// 0 8 * * * Schedule the cron job to run daily at 8:00 AM
cron.schedule('* * * * *', async () => {
    console.log("Checking for orders with upcoming return dates...");
  
    // Get the date one day from now
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 1);

    try {
      const orders = await Order.find({
        'borrowingInformation.returnDate': { $lte: upcomingDate }
      }).populate("user", "email name");

      for (const order of orders) {
        const returnDate = new Date(order.borrowingInformation.returnDate).toLocaleDateString();
        const emailOptions = {
          from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_EMAIL}>`,
          to: order.user.email,
          subject: 'Return Date Reminder',
          text: `Dear ${order.user.name},\n\nThis is a reminder that the return date for your borrowed item(s) is approaching on ${returnDate}.\n\nPlease ensure that you return the items on time.\n\nThank you!`,
        };

        await transporter.sendMail(emailOptions);
        console.log(`Reminder sent to ${order.user.email} for return date: ${returnDate}`);
      }
    } catch (error) {
      console.error("Error checking orders or sending emails:", error.message);
    }
});*/