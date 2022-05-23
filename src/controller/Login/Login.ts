import { Student } from "../../models/Student.model";
import { Admin } from "../../models/Admin.model";
import { Warden } from "../../models/Warden.model";
import * as Sentry from "@sentry/node";
import { LoginInput } from "../../types/ValidationInput";

export const Login = async (body: LoginInput): 
    Promise<{
    error: boolean,
    message: string,
    profile?: any}> => {
    try {
        if(body.role == "student") {
            const student = await Student.findOne({
                email: body.email
            });
            if(!student) {
                return {
                    error: true,
                    message: "Student not found!"
                }
            }
            if(student.active == false) {
                return {
                    error: true,
                    message: "Your account is not active!"
                };
            }
            const isMatch = await student.comparePassword(body.password);
            if(isMatch){
                return {
                    error: false,
                    message: "Login successful!",
                    profile: student.profile
                }
            }
            else {
                return {
                    error: true,
                    message: "Invalid password!"
                }
            }
        }
        else if(body.role == "warden"){
            const warden = await Warden.findOne({
                email: body.email
            });
            if(!warden) {
                return {
                    error: true,
                    message: "Warden not found!"
                }
            }
            
            const isMatch = warden.comparePassword(body.password);
            if(isMatch){
                return {
                    error: false,
                    message: "Login successful!",
                    profile: warden.profile
                }
            }
            else {
                return {
                    error: true,
                    message: "Invalid password!"
                }
            }
        }
        else if(body.role == "admin"){
            const admin = await Admin.findOne({
                email: body.email
            });
            if(!admin) {
                return {
                    error: true,
                    message: "Admin not found!"
                }
            }
            
            const isMatch = admin.comparePassword(body.password);
            if(isMatch){
                return {
                    error: false,
                    message: "Login successful!",
                    profile: admin.profile
                }
            }
            else {
                return {
                    error: true,
                    message: "Invalid password!"
                }
            }
        }
        else{
            return {
                error: true,
                message: "Invalid role!"
            };
        }
    }
    catch(err){
        Sentry.captureException(err);
        Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }
}