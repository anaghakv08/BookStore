const mongoose  =require("mongoose")

const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(res=>{
    console.log("MongoDB Connect succesfully");
    
}).catch(err=>{
    console.log(`MongoDB connection Failed Due to : ${err}`);
    
})