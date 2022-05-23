import mongoose from "mongoose";

export type LeaveApplicationDocument = mongoose.Document & {
    studentid: string;
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
        message: String,
        date_to: Date,
        date_from: Date,
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: "Pending" },
        remarks: String,
        seenBy: String
    }
);

export const LeaveApplication = mongoose.model<LeaveApplicationDocument>("LeaveApplication", LeaveApplicationSchema);