import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        itemId: { type: String, required: true, default: uuidv4 },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category',required: true},
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        status: { type: String, enum: ["Confirm", "Pending", "Cancel","Borrowing","Return","Non-returnable"], default: "Pending", require:true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      borrowingDate: { type: Date, required: true },
      returnedDate: { type: Date },
      returnDate: { type: Date },
      canceledDate: { type: Date },
      reason: { type: String, required: true },
      notificationSent: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;