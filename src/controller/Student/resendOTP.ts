import * as Sentry from "@sentry/node";
import { createOTP } from "../../utils/createOTP";
import { Student } from "../../models/Student.model";
import { sendOTPEmail } from "../../utils/mailer";

export const resendOTP = async (email: string) => {
    try{
        if(!email){
            return {
                error: true,
                message: "Email is required"
            };
        }
        const student = await Student.findOne({email: email});
        if(!student){
            return {
                error: true,
                message: "Student not found"
            };
        }
        // check if student account is already activated
        if(student.active){
            return {
                error: true,
                message: "Student account is already activated"
            };
        }
        const newOTP = createOTP();
        const expiry = Date.now() + 60 * 1000 * 15;  //Set expiry 15 mins ahead from now
        student.emailToken = newOTP;
        student.emailTokenExpires = new Date(expiry);
        await student.save();

        const sendEmail = await sendOTPEmail(email, newOTP);
        if(sendEmail.error){
            return {
                error: true,
                message: "Couldn't send verification email"
            };
        }
        return {
            error: false,
            message: "OTP resent successfully"
        };
    }   
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }
}