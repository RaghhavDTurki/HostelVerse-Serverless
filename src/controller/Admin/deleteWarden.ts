import * as Sentry from "@sentry/node";
import { Hostel } from "../../models/Hostel.model";
import { Warden } from "../../models/Warden.model";
import { DeleteWardenInput } from "../../types/ValidationInput";

export const deleteWarden = async (body: DeleteWardenInput) => {
    try {
        const warden = await Warden.findOneAndDelete({
            wardenId: body.wardenid
        });
        if(!warden){
            return {
                error: true,
                message: "Warden not found!"
            };
        }
        const hostel = await Hostel.findOne({ hostelId: warden.hostelid });
        if(!hostel){
            return {
                error: false,
                message: "Warden deleted successfully!"
            };
        }
        else{
            hostel.wardenid = null;
            await hostel.save();
            return {
                error: false,
                message: "Warden deleted successfully!"
            };
        }
    } 
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }
};