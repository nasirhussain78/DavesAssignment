import UserModel from "../models/userModel.js";
import OtpModel from "../models/otpModel.js";
import bcrypt from "bcrypt";
import otpGenerator from 'otp-generator';
import jwt from 'jsonwebtoken';
import OnboardingModel from "../models/onboardingModel.js";
const saltrounds = 10;

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


class UserController {

    async signup(req, res) {
        const data = req.body
        const { email } = data
        try {
            const user = await UserModel.findOne({ email: email });
            if (user) return res.status(400).send("user already exist")

            const OTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
            console.log(OTP)

            let hashOtp = bcrypt.hashSync(OTP, saltrounds);
            const otpData = { email, otp: hashOtp };
            const result = await OtpModel.create(otpData);
            return res.status(200).send({ status: true, msg: "Otp successfully send ", data: result });

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    async verifyOtp(req, res) {
        try {
            const data = req.body;
            const { name, email, phone, password, otp } = data;
            const otpPresent = await OtpModel.find({
                email: email
            })
            // res.send(otpPresent)
            if (otpPresent.length === 0) return res.status(400).send("you use an expired Otp or invalid")
            const rigthOtpFind = otpPresent[otpPresent.length - 1];
            const validUser = bcrypt.compare(otp, rigthOtpFind.otp);
            if (rigthOtpFind.email === email && validUser) {
                let hashPassword = bcrypt.hashSync(password, saltrounds);
                const userData = { name, email, phone, password: hashPassword, isEmailVerified: true }
                const createdUser = await UserModel.create(userData);
                await OtpModel.deleteMany({
                    email: rigthOtpFind.email
                })
                return res.status(201).send({ status: true, message: 'User successfully created', data: createdUser });
            }
        }

        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    async loginUser(req, res) {
        try {

            let data = req.body
            if (!isValidRequestBody(data)) {
                return res.status(400).send({ status: false, message: 'Please provide user details' })
            }
            const { email, password } = data

            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "email is required" })
            }
            if (!isValid(password)) {
                return res.status(400).send({ status: false, message: "passwords is required" })
            }

            if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }


            let user = await UserModel.findOne({ email });

            if (!user)
                return res.status(404).send({
                    status: false,
                    msg: "Login failed! No user found with the provided email.",
                });

            const isValidPassword = await bcrypt.compare(password, user.password)

            if (!isValidPassword)
                return res.status(404).send({
                    status: false,
                    msg: "Login failed! Wrong password.",
                });

            //token 1 hour expire time
            let token = jwt.sign(
                {
                    userId: user._id,
                }, "mySecretKey"
            );

            res.status(200).setHeader("x-api-key", token);
            return res.status(201).send({ status: "LoggedIn", message: 'Success', TOKEN: token });
        }
        catch (err) {

            return res.status(500).send({ ERROR: err.message })
        }
    }


    async onboarding(req, res) {
        try {           
            const result = await OnboardingModel.create(req.body);
            return res.status(201).send({ status: "true", message: 'Successfully created ', data: result });
        } catch (err) {
            console.error(err);
            res.status(400).send(err);
        }
    }


    async get(req, res) {
        try {
            const onboardings = await OnboardingModel.find();
            return res.status(200).send({ status: "true", data: onboardings });
          } catch (err) {
            console.error(err);
            res.status(400).send(err);
          }
    }

}

export default new UserController()

