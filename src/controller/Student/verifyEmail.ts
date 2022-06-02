import { Student } from "../../models/Student.model";
import * as Sentry from "@sentry/node";
import { VerifyEmailInput } from "../../types/ValidationInput";

export const verifyEmail = async (body: VerifyEmailInput) => {
    try{
        const { email, code } = body;
        const student = await Student.findOne({ email });
        if(!student){
            return {
                error: true,
                message: "Student not found."
            };
        }
        if(student.emailTokenExpires < new Date()){
            return {
                error: true,
                message: "Verification code expired."
            };
        }
        if(student.emailToken !== code){
            return {
                error: true,
                message: "Invalid OTP."
            };
        }
        student.emailToken = null;
        student.emailTokenExpires = null;
        student.active = true;
        student.save();
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