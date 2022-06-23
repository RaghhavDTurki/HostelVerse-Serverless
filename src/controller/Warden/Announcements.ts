import * as Sentry from "@sentry/node";
import { Warden } from "../../models/Warden.model";
import { Announcement } from "../../models/Announcement.model";
import { CreateAnnouncementInput } from "../../types/ValidationInput";

export const createAnnouncement = async (body: CreateAnnouncementInput) => {
    try {
        const wardenHostel = await Warden.findOne({ wardenid: body.wardenid }).select("hostelid").lean();
        if (!wardenHostel) {
            return {
                error: true,
                message: "Warden not found!"
            };
        }
        await Announcement.create({
            ...body,
            hostelid: wardenHostel.hostelid
        });
        return {
            error: false,
            message: "Announcement created successfully!"
        };
    } catch (err) {
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