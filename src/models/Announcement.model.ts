import mongoose from "mongoose";

export type AnnouncementDocument = mongoose.Document & {
    hostelid: string;
    wardenid: string;
    heading: string;
    message: string;
};

const AnnouncementSchema = new mongoose.Schema<AnnouncementDocument>(
    {
        hostelid: { type: String, $ref: "Hostel" },
        wardenid: { type: String, $ref: "Warden" },
        heading: String,
        message: String
    },
    { timestamps: true }
);

export const Announcement = mongoose.model<AnnouncementDocument>("Announcement", AnnouncementSchema);