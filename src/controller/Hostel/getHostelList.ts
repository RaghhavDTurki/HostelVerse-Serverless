import { Hostel } from "../../models/Hostel.model";
import * as Sentry from "@sentry/node";

export async function getHostel(hostelid: string, low: number, high: number) {
    try{
        if(!hostelid){
            const hostels = await Hostel.find().select("-_id -__v").lean();
            const filteredList = hostels.filter(hostel => hostel.fees >= low && hostel.fees <= high);
            return {
                error: false,
                data: filteredList
            }
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