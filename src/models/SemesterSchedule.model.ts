import mongoose from "mongoose";

export type SemesterScheduleDocument = mongoose.Document & {
    type: string;
    half: number;
    year: number;
    startDate: Date;
    endDate: Date;
    allotDate: Date;
    paymentDeadline: Date;
};

const SemesterScheduleSchema = new mongoose.Schema<SemesterScheduleDocument>(
    {
        type: { type: String, required: true },
        half: { type: Number, required: true },
        year: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        allotDate: { type: Date, default: null },
        paymentDeadline: { type: Date, default: null }
    }
);

export const SemesterSchedule = mongoose.model<SemesterScheduleDocument>("SemesterSchedule", SemesterScheduleSchema);