const jwt = require ("jsonwebtoken")

const adminjwtMiddleware =(req,res,next )=>{
    console.log("Inside JWT Admin Middleware");
    const token =req.headers.authorization.split(" ")[1]
    console.log(token);

  try { const jwtResponse = jwt.verify(token, process.env.JWTSecretKey)
    console.log(jwtResponse);
    req.payload =jwtResponse.userMail
    req.role=jwtResponse.role
    if(jwtResponse.role=="admin"){
        next()
    } else{
        res.status(401).json("Unauthorized user")
    }
    // console.log(req.payload);
    }catch(err){
        res.status(500).json("Invalid Token",err)
    }
}

module.exports =adminjwtMiddleware