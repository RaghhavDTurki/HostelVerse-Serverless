import mongoose from "mongoose";

export type AttendenceDocument = mongoose.Document & {
    studentid: string;
    last_checkin: Date;
    last_checkout: Date;
};

const AttendenceSchema = new mongoose.Schema<AttendenceDocument>(
    {
        studentid: { type: String, unique: true},
        last_checkin: { type: Date, default: null },
        last_checkout: { type: Date, default: null }
    }
);

export const Attendence = mongoose.model<AttendenceDocument>("Attendence", AttendenceSchema);