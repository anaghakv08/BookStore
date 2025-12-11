 //7. import dotenv
 require("dotenv").config() //loads .env file contents into process.env by default


// 1. import express
      
const express=require("express")

// 5. import cors

const cors = require("cors")

//8. import routes

const router =require("./router")

//11. import connection file

require("./db/connection")

// 2.  create server 

const bookstoreServer = express() //call the created expres (const express..)

//6. tell server to use cors 

bookstoreServer.use(cors())

//10. parse request

bookstoreServer.use(express.json())

//9.  tell server to use router

bookstoreServer.use(router)

// to get upload images 

bookstoreServer.use("/imguploads" , express.static("./imguploads"))



//3. create port 

const PORT=5000

// 4. tell server to listen

bookstoreServer.listen(PORT,()=>{
    console.log(`Bookstore server started running successfully at Port number : ${PORT}, waiting for client request`);
    
})

bookstoreServer.get("/", (req,res)=>{
    res.status(200).send(`Bookstore server started running successfully and waiting for client request `)
})

// bookstoreServer.post("/" , (req,res)=>{
//     res.status(200).send(`POST REQUEST`)
// })