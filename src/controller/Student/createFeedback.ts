import * as Sentry from "@sentry/node";
import { Feedback } from "../../models/Feedback.model";
import { CreateFeedbackInput } from "../../types/ValidationInput";

export const createFeedback = async (body: CreateFeedbackInput) => {
    try {
        const feedback = new Feedback(body);
        await feedback.save();
    } 
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err.message
        }
    }
}