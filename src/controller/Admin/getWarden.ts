import * as Sentry from "@sentry/node";
import { Warden } from "../../models/Warden.model";

export const getWarden = async (body: string) => {
    try {
        if (body) {
            const warden = await Warden.findOne({
                wardenid: body
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
        else {
            const wardens = await Warden.find().select("-_id -__v").lean();
            return {
                error: false,
                data: wardens
            };
        }
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