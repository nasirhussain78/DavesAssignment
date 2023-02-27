import express from 'express'
const router = express.Router();
import userController from '../controller/controller.js';
import authentication from '../middleware/auth.js';
 

router.post('/signup' , userController.signup);
router.post('/signup/verifyOtp' , userController.verifyOtp);
router.post('/login' , userController.loginUser);
router.post('/onboarding' ,authentication, userController.onboarding);
router.get('/get' ,authentication, userController.get);

export default router;