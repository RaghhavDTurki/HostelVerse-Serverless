import * as Sentry from "@sentry/node";
import { Feedback } from "../../models/Feedback.model";
import { Hostel } from "../../models/Hostel.model";
import { CreateFeedbackInput } from "../../types/ValidationInput";

export const createFeedback = async (body: CreateFeedbackInput) => {
    try {
        const hostel = await Hostel.findOne({ hostelid: body.hostelid }).select("-__v");
        if (!hostel) {
            return {
                error: true,
                message: "Hostel not found!"
            };
        }
        const feedback = new Feedback(body);
        await feedback.save();
        const numReviews = hostel.numberOfReviews;
        const overallRating = hostel.overallRating;
        const newOverallRating = (overallRating * numReviews + body.rating) / (numReviews + 1);
        const newNumReviews = numReviews + 1;
        hostel.overallRating = newOverallRating;
        hostel.numberOfReviews = newNumReviews;
        await hostel.save();
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