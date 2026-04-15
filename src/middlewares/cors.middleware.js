import cors from 'cors'

const corsOptions = {
    origin: 'http://68.183.226.223:20401',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}

export default cors(corsOptions)