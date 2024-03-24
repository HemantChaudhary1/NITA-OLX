// Now We will make Router and Routes 
import { Router } from "express";
import { toSell } from "../controllers/sell.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()


//SECURED ROUTES
router.route("/toSell").post(
    verifyJWT,
    upload.fields([             // Middleware is injected here before registerUser
       {name:"avatar",
       maxCount:5
       }
    ]),
    toSell) 



export default router