import express from "express";
import { constants } from "node:http2";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import authRouter from "./routes/auth.router.js";
import adminRouter from "./routes/admin.router.js";
import mainRouter from "./routes/main.router.js";
import productRouter from "./routes/product.router.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import corsMiddleware from "./middlewares/cors.middleware.js";

const app = express()
const PORT = process.env.PORT || 8888

// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Koda B6 Backend Node API",
            version: "1.0.0",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ["./src/routes/*.js", "./src/controller/*.js"],
}

const swaggerSpecs = swaggerJsdoc(swaggerOptions)

app.use(express.json())
app.use(corsMiddleware)

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use("/admin", adminRouter)
app.use("/auth", authRouter)
app.use("/", mainRouter)
app.use("/products", productRouter)

app.get("/", function(req, res) {
    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "backend running well",
    })
})

// Centralized error handler
app.use(errorHandler)

app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`)
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`)
})