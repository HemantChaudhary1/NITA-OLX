import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js" 
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
     
///****  Method to Generate access and refresh token  ****
const generateAccessAndRefereshTokens = async(userId) =>{
   try {
      //  console.log("Generating tokens for user:", userId); 
       const user = await User.findById(userId)
      //  console.log("User found:", user);

       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save()
      //  await user.save({ validateBeforeSave: false })

       return {accessToken, refreshToken}


   } catch (error) {
    console.log("ERRROR : ", error);
       throw new ApiError(500, "Something went wrong while generating referesh and access token")
   }
}


const registerUser = asyncHandler( async (req,res) =>{

         const { username, email, password, enrollmentNumber, phoneNumber, degree, address } = req.body;
         console.log("email:",email);


         if (![username, email, password, enrollmentNumber, phoneNumber, degree, address].every(field => field && field.trim())) {
            throw new ApiError(400, "All required fields must be provided");
        }


      const existedUser = await User.findOne({
         $or:[{ enrollmentNumber}, { email }]
       })
       
       if(existedUser){
        throw new ApiError(409,"User with username and email already exists")
       }


      const user = await User.create({
         username: username,
         enrollmentNumber,
         email,
         password,
         phoneNumber,
         degree,
         address
       })
      
         const createdUser= await User.findById(user._id).select(    
            "-password -refreshToken"
         ) 
    

        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering the user")
        }
 
       return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
       )
          

} )

//Login Controller

const loginUser = asyncHandler(async (req,res) => {
  
     const {email,username,password} = req.body;

   //***step2:- check username or email are not 
      if( !(username || email)){
         throw new ApiError(400,"username or email is required")
      }

   //***step3:- find the user
    const user = await User.findOne({
           $or:[{ username }, { email }]    //or is a mongoDB operator 
      }) 
    
      //If user not found then , throw error -> "User does not exist"
       if(!user){
         throw new ApiError(404,"User does not exist")
       }

   //***step4:-password check if not "password wrong" if yes then next step5
     const isPasswordValid = await user.isPasswordCorrect(password)
      
     if(!isPasswordValid){
      throw new ApiError(401,"Invalid Password ")
     }

  //***step5:-Generate access and refresh token 
  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
   
  //remove password and refresh token field from response
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
      
  //***step6:-Send these tokens to cookies
      const options = {
         httpOnly:true,    // These cokkies due to httpOnly are now not modifiable in frontend , they are modified from server side (Or)Backend only 
         secure:true
      }

  //***step7:-Return response ==> Successfully Logged in
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
         new ApiResponse(
            200,
            {
               user:loggedInUser,accessToken,refreshToken     // here accessToken,refreshToken are because if user want to save cookies on local machine for some testing ,==> It is a good practice
            },
            "User Logged In Successfully!!"
         )
      )

})

//***Logout controller***  ---> We want to logout user so we had write auth.middleware.js to get access of req.user beacuse in auth we have set req.user = user
  const logoutUser = asyncHandler(async(req,res) => {
      // to logout user , clear Or delete Cookies and also manage RefreshToken 
       
     await User.findByIdAndUpdate(
         req.user._id,
         {
            $set:{
               refreshToken:undefined
            }
         },
         {
            new:true
         }
      ) 

  //**clear cookies
      const options = {
         httpOnly:true,    
         secure:true
      }

      return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(200,{},"User Logged Out Successfully"))

  })

 
// Now we will make an endpoint where user can refresh his access token using refresh token
// **first we will make a controller and then make route in routes folder
 const refreshAccessToken = asyncHandler(async(req,res) =>{
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if(incomingRefreshToken){
         throw new ApiError(401,"unauthorized request beacuse your token is not correct")
        }
        
     try {
        
      const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
         )

      const user = await User.findById(decodedToken?._id)
      
      if(!user){
         throw new ApiError(401,"Invalid Refresh Token")
      }

      if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401,"Refresh Token is expired or used")
      }

   // now if both are matching 
        const options = {
         httpOnly:true,
         secure:true
        }

       const { accessToken , newRefreshToken} =await generateAccessAndRefereshTokens(user._id)

       return res
       .status(200)
       .cookie("accessToken",accessToken , options)
       .cookie("refreshToken", newRefreshToken,options)
       .json(
         new ApiResponse(
            200,
            { accessToken, refreshToken:newRefreshToken},
            "Access token refreshed successfully"
         )
       )

     } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refreshtoken")
     }

 }) 

export {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken
}

