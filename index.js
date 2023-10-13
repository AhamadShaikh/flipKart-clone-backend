const express = require("express")
const { default: mongoose } = require("mongoose")
const app = express()
require("dotenv").config()
const cors = require('cors');

const userRouter = require("./routes/userRoutes")

app.use(express.json())


const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log(error);
    }
}

app.use(cors());

app.use("/users", userRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    connection()
    console.log("port is running on 7000");
})