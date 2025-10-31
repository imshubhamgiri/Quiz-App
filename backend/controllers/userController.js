import mongoose from "mongoose";
import User from "../models/User.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const TOKEN_EXPIRES_IN = '24h'
const JWT_SECRET = 'your_key_here'

//complete this all

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Email'
            })
        }
        const exists = await User.findOne({ email }).lean();
        if (exists) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            })
        }

        const newId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            _id: newId,
            name,
            email,
            password: hashedPassword
        })
        await user.save()

        if (!JWT_SECRET) throw new Error('JWT Secret is not defined');
        const token = jwt.sign({ id: newId.toString() }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email }
        })


    } catch (e) {
        console.error('Registration error', e)
        return res.status(500).json({
            success: false,
            message: 'server error'
        })

    }
}

//login

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }
        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })
        return res.status(201).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email }
        })
    } catch (e) {
        console.error('Login error', e)
        return res.status(500).json({
            success: false,
            message: 'server error'
        })

    }
}