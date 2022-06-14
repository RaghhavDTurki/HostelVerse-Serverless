import * as Sentry from "@sentry/node";
import { AdminDocument } from "../../models/Admin.model";
import { StudentDocument } from "../../models/Student.model";
import { WardenDocument } from "../../models/Warden.model";

export const changePassword = async (newPassword: string, userModel: StudentDocument | WardenDocument | AdminDocument) => {
    try {
        if (!newPassword) {
            return {
                error: true,
                message: "New password is required!"
            };
        }
        userModel.password = newPassword;
        userModel.resetPasswordToken = null;
        userModel.resetPasswordExpires = null;
        await userModel.save();
        return {
            error: false,
            message: "Password changed successfully!",
            data: userModel
        };
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