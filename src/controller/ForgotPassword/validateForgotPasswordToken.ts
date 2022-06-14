import * as Sentry from "@sentry/node";
import { Student } from "../../models/Student.model";
import { Warden } from "../../models/Warden.model";
import { Admin } from "../../models/Admin.model";
import iron from "@hapi/iron";

const secretToken = process.env.SECRET_TOKEN;

export const valdiateForgotPasswordToken = async (token: string) => {
    try {
        if (!token) {
            return {
                error: true,
                message: "Token is required!"
            };
        }
        const decoded = await iron.unseal(token, secretToken, iron.defaults);
        if (decoded.role == "student") {
            const student = await Student.findOne({
                studentid: decoded.id
            });
            if (!student) {
                return {
                    error: true,
                    message: "Invalid token"
                };
            }
            if (student.resetPasswordToken != token) {
                return {
                    error: true,
                    message: "Invalid token"
                };
            }
            if (student.resetPasswordExpires < new Date()) {
                return {
                    error: true,
                    message: "Token expired"
                };
            }
            return {
                error: false,
                message: "Token is valid",
                data: student
            };
        }
        else if (decoded.role == "warden") {
            const warden = await Warden.findOne({
                wardenid: decoded.id
            });
            if (!warden) {
                return {
                    error: true,
                    message: "Invalid token"
                };
            }
            if (warden.resetPasswordToken != token) {
                return {
                    error: true,
                    message: "Invalid token"
                };
            }
            if (warden.resetPasswordExpires < new Date()) {
                return {
                    error: true,
                    message: "Token expired"
                };
            }
            return {
                error: false,
                message: "Token is valid",
                data: warden
            };
        }
        else if (decoded.role == "admin") {
            const admin = await Admin.findOne({
                adminid: decoded.id
            });
            if (!admin) {
                return {
                    error: true,
                    message: "Invalid token"
                };
            }
            if (admin.resetPasswordToken != token) {
                return {
                    error: true,
                    message: "Invalid token"
                };
            }
            if (admin.resetPasswordExpires < new Date()) {
                return {
                    error: true,
                    message: "Token expired"
                };
            }
            return {
                error: false,
                message: "Token is valid",
                data: admin
            };
        }
        else {
            return {
                error: true,
                message: "Invalid token!"
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
