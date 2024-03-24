// Now We will make Router and Routes 
import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMyProducts } from "../controllers/myProducts.controller.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//SECURED ROUTES
router.route("/logout").post(verifyJWT,logoutUser)  
router.route("/refresh-token").post(refreshAccessToken)
router.route("/myProducts").get(verifyJWT, getMyProducts);

export default router