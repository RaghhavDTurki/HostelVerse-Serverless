import { Hostel } from "../../models/Hostel.model";
import * as Sentry from "@sentry/node";

export async function getHostel(hostelid: string){
    try{
        if(!hostelid){
            return;
        }
        const hostel = await Hostel.findOne({ hostelid: hostelid }).select("-_id -__v").lean();
        return {
            error: false,
            message: "Hostel fetched successfully!",
            data: hostel
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