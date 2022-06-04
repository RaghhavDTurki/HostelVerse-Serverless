import { Hostel } from "../../models/Hostel.model";
import * as Sentry from "@sentry/node";
import { Feedback } from "../../models/Feedback.model";

export async function getHostel(hostelid: string, low: number, high: number) {
    try{
        if(!hostelid){
            const hostels = await Hostel.find().select("-_id -__v").lean();
            const filteredList = hostels.filter(hostel => hostel.fees >= low && hostel.fees <= high);
            const feedbacks = await Feedback.find().select("-_id -__v").lean();
            let competeHostelList = [];
            for(let i = 0; i < filteredList.length; i++){
                const hostel = filteredList[i];
                const feedback = feedbacks.filter(feedback => feedback.hostelid === hostel.hostelid);
                competeHostelList.push({
                    ...hostel,
                    feedback: feedback
                });
            }
            return {
                error: false,
                data: competeHostelList
            }
        }
        const hostel = await Hostel.findOne({ hostelid: hostelid }).select("-_id -__v").lean();
        const feedback = await Feedback.find({ hostelid: hostelid }).select("-_id -__v").lean();
        return {
            error: false,
            message: "Hostel fetched successfully!",
            data: {
                ...hostel,
                feedback: feedback
            }
        }
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        }
    }
}