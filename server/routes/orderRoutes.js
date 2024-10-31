import express from "express"
import { protect, admin } from "../middleware/authMiddleware.js"

import {
  addOrderItems,
  getUserOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  //updateOrderStatus,
  deleteOrder,
  updateOrderItemStatus,
  deleteOrderItem,
} from "../controllers/orderController.js"
const router = express.Router()

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/user-orders").get(protect, getUserOrders);
router.route("/:id").get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.route("/deliver/:id").patch(protect, admin, updateOrderToDelivered);
//router.route("/status/:id").patch(protect, updateOrderStatus);
router.route("/:orderId/items/:itemId/status").patch(protect, updateOrderItemStatus);
router.route("/:orderId/items/:itemId").delete(protect, admin, deleteOrderItem);
export default router
