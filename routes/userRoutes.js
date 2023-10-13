const express = require("express")
const { default: mongoose } = require("mongoose")
const app = express()
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../model/userModel")
const Btoken = require("../model/blacklist")


router.post("/register", async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({email})

        if (existingUser) {
            res.status(400).json({ msg: "User already registerd" })
        }

        const newPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({ ...req.body, password: newPassword })

        res.status(200).json({ msg: "User registered successfully" ,user:newUser})
    } catch (error) {
        res.status(400).json({ msg: "Internal Server Error" })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({email})

        if (!existingUser) {
            res.status(400).json({ msg: "User registerd first" })
        }

        const verifyUser = await bcrypt.compare(password, existingUser.password)

        if (!verifyUser) {
            res.status(400).json({ "msg": "Wrong credentials" })
        }

        const token = jwt.sign({ userId: existingUser._id, username: existingUser.username }, "thor", { expiresIn: "3d" })

        const rToken = jwt.sign({ userId: existingUser._id, username: existingUser.username }, "thanos", { expiresIn: "7d" })

        res.status(200).json({ msg: "User login successfully", token: token, refreshToken: rToken })
    } catch (error) {
        res.status(400).json({ msg: "Internal Server Error" })
    }
})

router.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {
        if (!token) {
            res.status(400).json({ msg: "login first" })
        }

        const isBlacklist = await Btoken.exists({ token })

        if (isBlacklist) {
            return res.status(400).json({ msg: "token has been already invalidated" })
        }

        await Btoken.create({token})

        res.status(200).json({ msg: "Logout Successfull" })
    } catch (error) {
        res.status(400).json({ msg: "Internal Server Error" })
    }
})

module.exports = router