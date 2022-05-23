import mongoose from "mongoose";

export type RoomDocument = mongoose.Document & {
    hostelid: string;
    roomno: string;
    allotmentstatus: boolean;
    type: string;
    occupants: [string] | null;
};

const RoomSchema = new mongoose.Schema<RoomDocument>(
    {
        hostelid: String,
        roomno: String,
        allotmentstatus: { type: Boolean, default: false },
        type: { type: String, enum: ["single", "double", "triple"] },
        occupants: [String]
    }


);

export const Room = mongoose.model<RoomDocument>("Room", RoomSchema);