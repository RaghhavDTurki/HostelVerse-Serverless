import { Admin } from "../../models/Admin.model";
import * as Sentry from "@sentry/node";
import { UpdateAdminProfile } from "../../types/ValidationInput";

export const getAdminProfile = async (adminid: string) => {
    try {
        if (!adminid) {
            return {
                error: true,
                message: "Admin id is required!"
            };
        }
        const admin = await Admin.findOne({
            adminid: adminid
        }).select("-_id -__v").lean();
        if (!admin) {
            return {
                error: true,
                message: "Admin not found!"
            };
        }
        return {
            error: false,
            data: admin
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: JSON.stringify({
                error: err.message
            })
        };
    }
};

export const updateAdminProfile = async (body: UpdateAdminProfile) => {
    try {
        if (!body.adminid) {
            return {
                error: true,
                message: "Admin id is required!"
            };
        }
        const admin = await Admin.findOne({
            adminid: body.adminid
        });
        if (!admin) {
            return {
                error: true,
                message: "Admin not found!"
            };
        }
        if (body.name) {
            admin.name = body.name;
            admin.profile.name = body.name;
        }
        if (body.email) {
            admin.email = body.email;
            admin.profile.email = body.email;
        }
        if (body.contactno) {
            admin.profile.contactno = body.contactno;
        }
        await admin.save();
        return {
            error: false,
            data: admin
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: JSON.stringify({
                error: err.message
            })
        };
    }
};