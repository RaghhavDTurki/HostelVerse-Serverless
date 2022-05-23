import mongoose from "mongoose";

export type FeedbackDocument = mongoose.Document & {
    studentid: string;
    name: string;
    hostelid: string;
    rating: number;
    message: string;
};

const FeedbackSchema = new mongoose.Schema<FeedbackDocument>(
    {
        studentid: { type: String },
        name: String,
        message: String,
        rating: Number,
        hostelid: String
    },
    { timestamps: true }
);

export const Feedback = mongoose.model<FeedbackDocument>("Feedback", FeedbackSchema);