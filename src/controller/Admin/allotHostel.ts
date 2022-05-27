import * as Sentry from "@sentry/node";
import { Student } from "../../models/Student.model";
import { Hostel } from "../../models/Hostel.model";
import { Room } from "../../models/Room.model";
import { AllotHostel } from "../../types/ValidationInput";

export const allotHostel = async (body: AllotHostel) => {
    try{
        const hostels = body.hostelid;
        const batches = body.batch;
        if(hostels.length != batches.length){
            return {
                error: true,
                message: "Hostel and batch should be same length!"
            }
        }
        for(let i = 0; i < hostels.length; i++)
        {
            const hostelid = hostels[i];
            const batch = batches[i];
            const studentsEnrolled = await Student.find({ batch: batch }).select("-_id -__v");
            const hostel = await Hostel.findOne({ hostelid: hostelid }).select("-_id -__v");
            const roomList = await Room.find({ hostelid: hostelid, allotmentstatus: false });
            if(studentsEnrolled.length > hostel.totalCapacity){

            }
            else{
                
            }
        }
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