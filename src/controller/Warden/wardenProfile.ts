import * as Sentry from "@sentry/node";
import { Warden } from "../../models/Warden.model";
import { UpdateWardenProfile } from "../../types/ValidationInput";

export const getWardenProfile = async (wardenid: string) => {
    try {
        if (!wardenid) {
            return {
                error: true,
                message: "Warden id is required!"
            };
        }
        const warden = await Warden.findOne({
            wardenid: wardenid
        }).select("-_id -__v").lean();
        if (!warden) {
            return {
                error: true,
                message: "Warden not found!"
            };
        }
        return {
            error: false,
            data: warden
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

export const updateWardenProfile = async (body: UpdateWardenProfile) => {
    try {
        if (!body.wardenid) {
            return {
                error: true,
                message: "Warden id is required!"
            };
        }
        const warden = await Warden.findOne({
            wardenid: body.wardenid
        });
        if (!warden) {
            return {
                error: true,
                message: "Warden not found!"
            };
        }
        if (body.name) {
            warden.name = body.name;
            warden.profile.name = body.name;
        }
        if (body.email) {
            warden.email = body.email;
            warden.profile.email = body.email;
        }
        if (body.contactno) {
            warden.profile.contactno = body.contactno;
        }
        await warden.save();
        return {
            error: false,
            data: warden
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