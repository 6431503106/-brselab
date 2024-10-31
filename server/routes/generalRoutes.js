import express from "express";
/*import { protect, admin } from "../middleware/authMiddleware.js";*/

import { 
    contactUs, 
    getMessages, 
    handleMessages } from "../controllers/generalController.js";

const router = express.Router(); 

router.route("/contact-us").post (contactUs);
router.route("/contact-us").get ( getMessages);
router.route("/handle-messages").post ( handleMessages);

export default router;