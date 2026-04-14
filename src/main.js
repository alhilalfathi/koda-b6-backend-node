import express from "express";
import {constants} from "node:http2";
import authRouter from "./routes/auth.router.js";
import adminRouter from "./routes/admin.router.js";
import mainRouter from "./routes/main.router.js";
import productRouter from "./routes/product.router.js";

const app = express()
const PORT = process.env.PORT || 8888

app.use(express.json())

app.use("/admin", adminRouter)
app.use("/auth", authRouter)
app.use("/", mainRouter)
app.use("/products", productRouter)

app.get("/", function(req,res){
    req.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "backend running well",
    })
})

app.listen(PORT, function(){
    console.log(`App listening on port ${PORT}`)
})
