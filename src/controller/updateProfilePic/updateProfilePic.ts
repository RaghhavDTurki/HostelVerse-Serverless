import * as Sentry from "@sentry/node";
import { Warden } from "../../models/Warden.model";
import { Student } from "../../models/Student.model";
import { Admin } from "../../models/Admin.model";

export const updateProfilePic = async (role: string, id: string, url: string) => {
    try {
        if (role === "student") {
            const student = await Student.findOne({ studentid: id });
            if (!student) {
                return {
                    error: true,
                    message: "Student not found!"
                };
            }
            student.profile.picture = url;
            await student.save();
            return {
                error: false,
                message: "Profile pic updated successfully!",
                data: student.profile
            };
        }
        else if (role === "admin") {
            const admin = await Admin.findOne({ adminid: id });
            if (!admin) {
                return {
                    error: true,
                    message: "Admin not found!"
                };
            }
            admin.profile.picture = url;
            await admin.save();
            return {
                error: false,
                message: "Profile pic updated successfully!",
                data: admin.profile
            };
        }
        else if (role === "warden") {
            const warden = await Warden.findOne({ wardenid: id });
            if (!warden) {
                return {
                    error: true,
                    message: "Warden not found!"
                };
            }
            warden.profile.picture = url;
            await warden.save();
            return {
                error: false,
                message: "Profile pic updated successfully!",
                data: warden.profile
            };
        }
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }
};