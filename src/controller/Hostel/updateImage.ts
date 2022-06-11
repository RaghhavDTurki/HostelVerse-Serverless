import * as Sentry from "@sentry/node";
import { Hostel } from "../../models/Hostel.model";

export const updateImage = async (hostelid: string, url: string) => {
    try {
        const hostel = await Hostel.findOne({ hostelid: hostelid });
        if (!hostel) {
            return {
                error: true,
                message: "Hostel not found"
            };
        }
        hostel.image = url;
        await hostel.save();
        return {
            error: false,
            message: "Hostel image updated successfully"
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