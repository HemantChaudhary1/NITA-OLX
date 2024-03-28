// Now We will make Router and Routes 
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { rentItem } from "../controllers/rent.controller.js";

const router = Router()


//SECURED ROUTES
router.route("/rentItem").post( verifyJWT,rentItem) 



export default router