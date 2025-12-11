const express =require("express")
const { registerController, loginController, updateUserProfileController, getAllUsersAdminController, updateAdminProfileController, googleLoginController } = require("./controller/userController")
const { addBookController, getHomeBooksController, getAllBooksController, getABookController, getUserBooksController, deleteUserAddedBookController, getPurchasedBookController, getAllBooksAdminController, updateBookController, makeBookPayamentController } = require("./controller/bookController")


const jwtMiddleware =require ("./middlewares/jwtMiddleware")
const multerConfig = require("./middlewares/imgMulterMiddleware")

// admin middleware

const adminjwtMiddleware =require("./middlewares/adminjwtMiddleware")

// const controller=require("./controller/userController")

const router =express.Router()

//register

router.post("/register" ,registerController)

//login

router.post("/login" ,loginController)


// google login 

router.post ("/google-login",googleLoginController)

// -------------user------------

// get home book

router.get("/home-books" ,getHomeBooksController)

//add book


router.post("/add-book" ,jwtMiddleware, multerConfig.array("uploadImages",3), addBookController)

// get all books

router.get("/all-books",jwtMiddleware,getAllBooksController)

// get a book 
router.get("/view-book/:id",jwtMiddleware, getABookController)

// get bookstatus

router.get("/user-books",jwtMiddleware,getUserBooksController)

// delete a user added book

router.delete("/delete-book/:id",deleteUserAddedBookController)

// purchased book

router.get("/purchase-history",jwtMiddleware,getPurchasedBookController)

// userprofile upadation

router.put("/update-user-profile",jwtMiddleware,multerConfig.single("profile"),updateUserProfileController)


// -------------Admin------------

// get all book in admin

router.get("/get-allbooks",getAllBooksAdminController)

// update book

router.put("/update-book/:id", updateBookController)

// get all users in admin

router.get("/get-allusers",adminjwtMiddleware,getAllUsersAdminController)

// update admin profile

router.put("/update-admin-profile",adminjwtMiddleware,multerConfig.single("profile"),updateAdminProfileController)

// make payment -user

router.put("/make-payment",jwtMiddleware,makeBookPayamentController)


module.exports=router    

