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
            message: err
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
        const warden = await Warden.findOneAndUpdate({
            wardenid: body.wardenid
        }, body, { new: true });
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
            message: err
        };
    }
};