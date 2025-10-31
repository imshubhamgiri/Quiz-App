import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const JWT_SECRET = 'your_key_here'

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorization or token missing'
        });

    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // req.user = { id: decoded.id };
        // next();
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        req.user = user;
        next();
    } catch (e) {
        console.error('JWT VERFICATION FAILED', e);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}