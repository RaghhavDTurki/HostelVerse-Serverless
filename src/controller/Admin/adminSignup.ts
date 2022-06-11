import { AdminSignupInput } from "../../types/ValidationInput";
import * as Sentry from "@sentry/node";
import { Admin } from "../../models/Admin.model";
export const adminSignup = async (body:AdminSignupInput) => {
    try{
        if(await Admin.findOne({ email: body.email })){
            return {
                error: true,
                message: "Admin already exists!"
            };
        }
        const newAdmin = new Admin();
        newAdmin.email = body.email;
        newAdmin.password = body.password;
        newAdmin.profile.name = body.name;
        newAdmin.profile.email = body.email;
        newAdmin.profile.contactno = body.contactno;
        newAdmin.adminid = body.adminid;
        await newAdmin.save();
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err.message
        };
    }
};