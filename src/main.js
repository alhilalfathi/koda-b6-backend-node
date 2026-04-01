import express from "express";
import {constants} from "node:http2";
import userRouter from "./routes/users.router.js";
import authRouter from "./routes/auth.router.js";

const app = express()
const PORT = process.env.PORT || 8888

app.use(express.json())

app.use("/user", userRouter)
app.use("/auth", authRouter)

app.get("/", function(req,res){
    req.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "backend running well",
    })
})

app.listen(PORT, function(){
    console.log(`App listening on port ${PORT}`)
})
