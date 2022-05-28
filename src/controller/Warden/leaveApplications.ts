import * as Sentry from "@sentry/node";
import { LeaveApplication } from "../../models/LeaveApplication.model";
import { Warden } from "../../models/Warden.model";
import { UpdateLeaveApplication } from "../../types/ValidationInput";

export const getLeaveApplications = async (studentid: string, wardenid: string) => {
    try {
        if(!wardenid){
            return {
                error: true,
                message: "Warden id is required!"
            }
        }
        const wardenHostel = await Warden.findOne({ wardenid: wardenid }).select("hostelid").lean();
        if(studentid){
            const leaveApplication = await LeaveApplication.findOne({
                studentId: studentid,
                hostelId: wardenHostel.hostelid
            }).select("-_id -__v").lean();
            if(!leaveApplication){
                return {
                    error: true,
                    message: "Student not found!"
                }
            }
            return {
                error: false,
                data: leaveApplication
            };
        }
       else{
            const leaveApplications = await LeaveApplication.find({ hostelid: wardenHostel.hostelid }).select("-_id -__v").lean();
            return {
                error: false,
                data: leaveApplications
            }
       }
    } 
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        }
    }
}

export const updateLeaveApplication = async (body: UpdateLeaveApplication) => {
    try{
        if(!body.studentid){
            return {
                error: true,
                message: "Student id is required!"
            }
        }
        const wardenHostel = await Warden.findOne({ wardenid: body.wardenid }).select("hostelid").lean();
        const leaveApplication = await LeaveApplication.findOneAndUpdate({
            studentId: body.studentid,
            hostelId: wardenHostel.hostelid
        }, body, { new: true }).select("-_id -__v").lean();
        if(!leaveApplication){
            return {
                error: true,
                message: "Student not found!"
            }
        }
        return {
            error: false,
            data: leaveApplication
        };
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
    }
}