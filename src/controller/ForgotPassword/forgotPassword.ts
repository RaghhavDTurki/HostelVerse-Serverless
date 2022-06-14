import * as Sentry from "@sentry/node";
import { Student } from "../../models/Student.model";
import { Warden } from "../../models/Warden.model";
import { Admin } from "../../models/Admin.model";
import { createToken } from "../../utils/createToken";
import { sendForgotPassowrdEmail } from "../../utils/forgotPasswordMail";

export const forgotPasswordSendEmail = async (email: string) => {
    try {
        if (!email) {
            return {
                error: true,
                message: "Email is required!"
            };
        }
        const student = await Student.findOne({
            email: email
        });
        const warden = await Warden.findOne({
            email: email
        });
        const admin = await Admin.findOne({
            email: email
        });
        if (!student && !warden && !admin) {
            return {
                error: true,
                message: "Email not found!"
            };
        }
        if (student) {
            const token = await createToken({
                id: student.profile.studentid,
                role: "student"
            });
            if (token.error) {
                return {
                    error: true,
                    message: token.message
                };
            }
            student.resetPasswordToken = token.message;
            student.resetPasswordExpires = new Date(Date.now() + 60 * 1000 * 15);
            await student.save();

            const sendEmail = await sendForgotPassowrdEmail(token.message, student.profile.name, student.profile.email);
            if (sendEmail.error) {
                return {
                    error: true,
                    message: sendEmail.message
                };
            }
            return {
                error: false,
                message: "Reset password email sent successfully!"
            };
        }
        else if (warden) {
            const token = await createToken({
                id: warden.wardenid,
                role: "warden"
            });
            if (token.error) {
                return {
                    error: true,
                    message: token.message
                };
            }
            warden.resetPasswordToken = token.message;
            warden.resetPasswordExpires = new Date(Date.now() + 60 * 1000 * 15);
            await warden.save();

            const sendEmail = await sendForgotPassowrdEmail(token.message, warden.profile.name, warden.profile.email);
            if (sendEmail.error) {
                return {
                    error: true,
                    message: sendEmail.message
                };
            }
            return {
                error: false,
                message: "Reset password email sent successfully!"
            };
        }
        else if (admin) {
            const token = await createToken({
                id: admin.adminid,
                role: "admin"
            });
            if (token.error) {
                return {
                    error: true,
                    message: token.message
                };
            }
            admin.resetPasswordToken = token.message;
            admin.resetPasswordExpires = new Date(Date.now() + 60 * 1000 * 15);
            await admin.save();

            const sendEmail = await sendForgotPassowrdEmail(token.message, admin.profile.name, admin.profile.email);
            if (sendEmail.error) {
                return {
                    error: true,
                    message: sendEmail.message
                };
            }
            return {
                error: false,
                message: "Reset password email sent successfully!"
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