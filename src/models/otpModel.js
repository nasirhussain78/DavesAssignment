import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        index: { expires: 200}
    }
}, { timestamps: true });


export default mongoose.model('OTP', otpSchema);