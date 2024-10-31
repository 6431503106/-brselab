import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cron from "node-cron";
import User from '../models/userModel.js';

dotenv.config(); 

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems } = req.body;

  if (orderItems?.length === 0) {
    res.status(400);
    throw new Error("No Order Items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id,
        borrowingDate: item.borrowingDate || new Date(),
        returnDate: item.returnDate || null,
        reason: item.reason || "No reason provided",
      })),
      user: req.user._id,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});


// @desc    Fetch an order with user details
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("user");
  res.json(orders);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "id name");
  res.send(orders);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId);

  if (order) {
    await Order.deleteOne({ _id: order._id });
    res.status(204).json({ message: "Order Deleted" });
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});
//orderController.js
const deleteOrderItem = asyncHandler(async (req, res) => {
  const { orderId, itemId } = req.params;
  const order = await Order.findById(orderId);

  if (order) {
    const itemIndex = order.orderItems.findIndex(item => item.itemId === itemId);

    if (itemIndex !== -1) {
      order.orderItems.splice(itemIndex, 1);
      await order.save();
      if (order.orderItems.length === 0) {

        await Order.findByIdAndDelete(orderId);
        res.json({ message: 'Order and item deleted successfully' });
      } else {
        res.json({ message: 'Item removed from order' });
      }
    } else {
      res.status(404);
      throw new Error('Item not found');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


const borrowProduct = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    const currentDate = new Date();

    // Loop through each order item, only update the borrowing date, return date will be selected by the user
    order.orderItems.forEach(item => {
      item.borrowingDate = currentDate;  // Set borrowingDate to current date
      // Do not auto-calculate returnDate anymore, it will be provided by the user
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});


const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT, 
  secure: false, // Use true for port 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD 
  },
  logger: true, // log information
});

// 0 8 * * * Schedule the cron job to run daily at 8:00 AM,* * * * * every 1 min
cron.schedule('0 8 * * *', () => {
  checkUpcomingReturnDates();
});

export const checkUpcomingReturnDates = async () => {
  console.log("Checking for orders with upcoming return dates...");

  const now = new Date();
  const upcomingDate = new Date(now);
  upcomingDate.setDate(upcomingDate.getDate() + 3); // Add n days for return date check

  try {
    const orders = await Order.find({
      'orderItems.returnDate': { $lte: upcomingDate },  // Find items with return dates approaching
      'orderItems.notificationSent': { $ne: true },     // Only get items that haven't been notified
      'orderItems.status': 'Borrowing'                  // Check that the item is in Borrowing status
    }).populate("user", "email name");

    console.log(`Found ${orders.length} orders with return dates`);

    for (const order of orders) {
      let notificationSent = false;

      for (const item of order.orderItems) {
        // Check if the returnDate is defined, notification has not been sent yet, and status is "Borrowing"
        if (item.returnDate && !item.notificationSent && item.status === "Borrowing") {
          const returnDate = new Date(item.returnDate).toLocaleDateString();
          const emailOptions = {
            from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_EMAIL}>`,
            to: order.user.email,
            subject: 'Return Date Reminder',
            text: `Dear ${order.user.name},\n\nThis is a reminder that the return date for your borrowed item '${item.name}' is approaching on: ${returnDate}.\n\nPlease ensure that you return the items on time.\n\nThank you!`,
          };

          await transporter.sendMail(emailOptions); // Send the email
          console.log(`Reminder sent to ${order.user.email} for item: ${item.name} with return date: ${returnDate}`);

          // Mark the item as notified
          item.notificationSent = true;
          notificationSent = true;  // At least one notification has been sent for this order
        }
      }

      // Save the order only if a notification was sent for any of its items
      if (notificationSent) {
        await order.save();
      }
    }

    if (orders.length === 0) {
      console.log("No upcoming return dates.");
    }
  } catch (error) {
    console.error("Error checking orders or sending emails:", error.message);
  }
};

const updateReturnDate = async (orderId, itemId, newReturnDate) => {
  try {
    await Order.updateOne(
      { _id: orderId, "orderItems._id": itemId }, // Find the specific order and item
      {
        $set: { "orderItems.$.returnDate": newReturnDate, "orderItems.$.notificationSent": false }, // Update returnDate and reset notificationSent
      }
    );
    console.log("Return date updated and notification status reset.");
  } catch (error) {
    console.error("Error updating return date:", error.message);
  }
};
////sssss

const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status, returnDate } = req.body; // Assume returnDate is provided by the user

  try {
    // Find the order and the specific item by itemId
    const order = await Order.findOne({ _id: orderId, "orderItems._id": itemId }).populate("user", "email name");

    if (!order) {
      return res.status(404).json({ message: "Order or item not found" });
    }

    const item = order.orderItems.find(item => item._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in the order" });
    }

    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Status-specific logic
    if (status === "Borrowing" && item.status === "Confirm") {
      if (product.countInStock <= 0) {
        return res.status(400).json({ message: "Not enough stock to confirm the order" });
      }
      product.countInStock -= item.qty;
      item.borrowingDate = new Date(); // Set current date as borrowing date
      item.returnDate = returnDate || item.returnDate; // Update returnDate if provided
      item.notificationSent = false; // Reset notification flag

    } else if (status === "Non-returnable" && item.status === "Confirm") {
      product.countInStock -= item.qty;
      item.notificationSent = true; // No need for notifications
      item.returnDate = null; // No return date for non-returnable items

    } else if (status === "Return" && item.status === "Borrowing") {
      product.countInStock += item.qty;
      item.returnedDate = new Date();
      item.returnDate = null; // Clear the return date once returned

    } else if (status === "Cancel" && item.status !== "Cancel") {
      item.canceledDate = new Date();
      item.returnDate = null; // Clear return date on cancellation
    }

    item.status = status; // Update the item's status

    // Save the updated product and order
    await product.save();
    await order.save();

    // Prepare email notifications
    const borrowingDate = item.borrowingDate ? new Date(item.borrowingDate).toLocaleDateString() : 'N/A'; // Format the borrowing date

    // Prepare the email content based on the status
    let subject, message;
    if (status === "Confirm") {
      subject = 'Status notification from SE LAB';
      message = `Dear ${order.user.name},\n\nYour request for the ${item.name} has been confirmed!\n\nBorrowing Date: ${borrowingDate}\n\nClick this link https://brselab.onrender.com/ \nThank you.`;
    } else if (status === "Cancel") {
      subject = 'Status notification from SE LAB';
      message = `Dear ${order.user.name},\n\nYour request has been canceled.\n\nProduct name: ${item.name}\n\nIf you have any questions, please contact us.`;
    } else if (status === "Non-returnable") {
      subject = 'Status notification from SE LAB';
      message = `Dear ${order.user.name},\n\nThe item ${item.name} is now marked as non-returnable.\n\nNo return date is applicable.\n\nThank you.`;
    }

    // Send the email if necessary
    if (message && order.user && order.user.email) {
      await sendEmail({
        email: order.user.email,
        subject,
        message,
      });
    } else if (!order.user.email) {
      console.error('No recipients defined');
    }

    // Respond with the updated order
    res.json(order);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});





export {
  addOrderItems,
  getOrderById,
  getUserOrders,
  getOrders,
  updateOrderToDelivered,
  borrowProduct,
  deleteOrder,
  updateOrderItemStatus,
  deleteOrderItem,
  updateReturnDate,
};