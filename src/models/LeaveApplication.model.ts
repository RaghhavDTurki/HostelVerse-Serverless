import mongoose from "mongoose";

export type LeaveApplicationDocument = mongoose.Document & {
    studentid: string;
    hostelid: string;
    message: string;
    date_from: Date;
    date_to: Date;
    status: string;
    remarks: string;
    seenBy: string;
};

const LeaveApplicationSchema = new mongoose.Schema<LeaveApplicationDocument>(
    {
        studentid: String,
        hostelid: String,
        message: String,
        date_to: Date,
        date_from: Date,
        status: { type: String, default: "Pending" },
        remarks: String,
        seenBy: String
    }
);

export const LeaveApplication = mongoose.model<LeaveApplicationDocument>("LeaveApplication", LeaveApplicationSchema);