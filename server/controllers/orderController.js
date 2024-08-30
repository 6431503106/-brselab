import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cron from "node-cron";
import User from '../models/userModel.js';
//import { v4 as uuidv4 } from 'uuid';

dotenv.config(); 



const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    borrowingInformation,
    borrowingDate,
    reason,
    returnDate,
  } = req.body;

  if (orderItems?.length === 0) {
    res.status(400);
    throw new Error("No Order Items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id,
      })),
      user: req.user._id,
      borrowingInformation,
      borrowingDate,
      reason,
      returnDate,
    });
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

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
    currentDate.setHours(currentDate.getHours() + 0); // เปลี่ยนเป็นเวลา UTC+7

    order.borrowingDate = currentDate;

    const returnDate = new Date(currentDate); // ใช้ currentDate ที่ปรับเวลาแล้ว
    returnDate.setDate(returnDate.getDate() + 7); // เพิ่ม 7 วันตามเงื่อนไขการคืนสินค้า
    order.returnDate = returnDate;

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
  debug: true, // enable debug output
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
  upcomingDate.setDate(upcomingDate.getDate() + 3); // เพิ่ม n+1 วันสำหรับการตรวจสอบวันคืน

  try {
    const orders = await Order.find({
      'borrowingInformation.returnDate': { $lte: upcomingDate },
      notificationSent: { $ne: true } // ตรวจสอบว่ายังไม่ได้ส่งการแจ้งเตือน
    }).populate("user", "email name");

    console.log(`Found ${orders.length} orders with return dates`);

    const notifiedUsers = new Set(); // ใช้ Set เพื่อเก็บข้อมูลของผู้ใช้ที่ได้รับการแจ้งเตือนแล้ว

    for (const order of orders) {
      if (!notifiedUsers.has(order.user._id.toString())) {
        const returnDate = new Date(order.borrowingInformation.returnDate).toLocaleDateString();
        const emailOptions = {
          from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_EMAIL}>`,
          to: order.user.email,
          subject: 'Return Date Reminder',
          text: `Dear ${order.user.name},\n\nThis is a reminder that the return date for your borrowed item(s) is approaching on DD/MM/YYYY: ${returnDate}.\n\nPlease ensure that you return the items on time.\n\nThank you!`,
        };

        await transporter.sendMail(emailOptions);
        console.log(`Reminder sent to ${order.user.email} for return date: ${returnDate}`);

        // อัปเดตสถานะการแจ้งเตือนหลังจากส่งอีเมล
        await Order.updateMany(
          { 'borrowingInformation.returnDate': order.borrowingInformation.returnDate },
          { $set: { notificationSent: true } }
        );

        notifiedUsers.add(order.user._id.toString()); 
      }
    }

    if (orders.length === 0) {
      console.log("No upcoming return dates.");
    }
  } catch (error) {
    console.error("Error checking orders or sending emails:", error.message);
  }
};

const updateReturnDate = async (orderId, newReturnDate) => {
  try {
    // อัปเดตวันที่คืนและรีเซ็ตสถานะการแจ้งเตือน
    await Order.updateOne(
      { _id: orderId },
      { $set: { 'borrowingInformation.returnDate': newReturnDate, notificationSent: false } }
    );
    console.log("Return date updated and notification status reset.");
  } catch (error) {
    console.error("Error updating return date:", error.message);
  }
};



const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOne({
      _id: orderId,
      "orderItems._id": itemId,
    }).populate("user", "email name");

    if (!order) {
      return res.status(404).json({ message: "Order or item not found" });
    }

    const item = order.orderItems.find((item) => item._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in the order" });
    }

    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Adjust stock based on status changes
    if (status === "Confirm" && item.status !== "Confirm") {
      if (product.countInStock <= 0) {
        return res.status(400).json({ message: "Not enough stock to confirm the order" });
      }

    } else if (status === "Borrowing" && item.status === "Confirm") {
      if (product.countInStock <= 0) {
          return res.status(400).json({ message: "Not enough stock to confirm the order" });
      }
      product.countInStock -= item.qty;
  
      // Adjust dates
      const now = new Date();
      now.setHours(now.getHours() + 0); // Adjust to UTC+7
      order.borrowingInformation.borrowingDate = now;
      const returnDate = new Date(now);
      returnDate.setDate(returnDate.getDate() + 7);  // Create return date 7 days after borrowing
      order.borrowingInformation.returnDate = returnDate;

    } else if (status === "Return" && item.status === "Borrowing") {
      product.countInStock += item.qty;

      // Adjust return dates
      const previousReturnDate = new Date();
      previousReturnDate.setHours(previousReturnDate.getHours() + 0);
      order.borrowingInformation.previousReturnDate = previousReturnDate;
      order.borrowingInformation.returnDate = null; //คืนมาแล้ววันคืนให้เป็น Null

    } else if (status === "Cancel" && item.status !== "Cancel") {
      const canceledDate = new Date();
      canceledDate.setHours(canceledDate.getHours() + 0);
      order.borrowingInformation.canceledDate = canceledDate;
      order.borrowingInformation.returnDate = null;
    } else if (status === "Pending" && item.status !== "Pending") {
        // ตรวจสอบว่ามีวันที่ยืมอยู่แล้วหรือไม่
        if (order.borrowingInformation.borrowingDate) {
          const borrowingDate = new Date(order.borrowingInformation.borrowingDate);
          const returnDate = new Date(borrowingDate);
          returnDate.setDate(borrowingDate.getDate() + 7);  // เพิ่ม 7 วันจาก borrowingDate
          
          order.borrowingInformation.returnDate = returnDate;
        } else {
          // กรณีไม่มีวันที่ยืม ให้ทำการจัดการตามที่จำเป็น (อาจจะกำหนด borrowingDate ใหม่หรือแจ้งเตือน)
          console.error("Borrowing date is not set.");
        }
      } else if (status === "Non-returnable" && item.status !== "Non-returnable") {
        // Adjust stock and remove return date for "Non-returnable" status
        product.countInStock -= item.qty;
      
        // Set returnDate to null when status is "Non-returnable"
        order.borrowingInformation.returnDate = null;
      }      

    item.status = status;

    await product.save();
    await order.save();

    // Log the user email before sending
    console.log("User email:", order.user.email);

    // Retrieve borrowing date
    const borrowingDate = order.borrowingInformation.borrowingDate;
    // Format the borrowing date (optional)
    const formattedBorrowingDate = borrowingDate ? new Date(borrowingDate).toLocaleDateString() : 'N/A';

    // Send an email notification based on the status
    let message;
    let subject;

    /*if (status === "Confirm") {
      subject = 'Status notification from SE LAB';
      message = `Dear ${order.user.name},\n\nYour request for the ${item.name} has been confirmed!\n\nBorrowing Date: ${formattedBorrowingDate}\n\nThank you.`;
    } else*/ if (status === "Cancel") {
      subject = 'Status notification from SE LAB';
      message = `Dear ${order.user.name},\n\nYour request has been canceled.\n\nProduct name: ${item.name}\n\nIf you have any questions, please contact us.`;
    } else if (status === "Non-returnable") {
      subject = 'Status notification from SE LAB';
      message = `Dear ${order.user.name},\n\nThe item ${item.name} is now marked as non-returnable.\n\nNo return date is applicable.\n\nThank you.`;
    }

    if (message && order.user && order.user.email) {
      await sendEmail({
        email: order.user.email,
        subject,
        message,
      });
    } else if (!order.user.email) {
      console.error('No recipients defined');
    }

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