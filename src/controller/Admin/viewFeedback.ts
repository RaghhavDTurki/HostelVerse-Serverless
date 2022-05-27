import * as Sentry from "@sentry/node";
import { Feedback } from "../../models/Feedback.model";
import { Admin } from "../../models/Admin.model";

export const viewFeedback = async (adminid: string, feedbackid?: string) => {
    try{
        if(!adminid){
            return {
                error: true,
                message: "Admin id is required!"
            }
        }
        const admin = await Admin.findOne({
            adminid: adminid
        }).select("-_id -__v").lean();
        if(!admin){
            return {
                error: true,
                message: "Admin not found!"
            }
        }
        if(feedbackid){
            const feedback = await Feedback.findOne({
                feedbackid: feedbackid
            }).select("-_id -__v").lean();
            if(!feedback){
                return {
                    error: true,
                    message: "Feedback not found!"
                }
            }
            return {
                error: false,
                data: feedback
            };
        }
        const feedbacks = await Feedback.find().select("-_id -__v").lean();
        return {
            error: false,
            data: feedbacks
        };
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }
}