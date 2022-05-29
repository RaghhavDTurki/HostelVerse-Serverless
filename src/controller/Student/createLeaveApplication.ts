import * as Sentry from "@sentry/node";
import { LeaveApplication } from "../../models/LeaveApplication.model";
import { Student } from "../../models/Student.model";
import { CreateLeaveApplicationInput } from "../../types/ValidationInput";

export const createLeaveApplication = async (body: CreateLeaveApplicationInput) => {
    try {
        const student = await Student.findOne({ studentid: body.studentid }).lean();
        if(!student.roomAlloted){
            return {
                error: true,
                message: "Student is not allotted a room"
            }
        }
        body.hostelid = student.hostelid;
        const leaveApplication = new LeaveApplication(body);
        await leaveApplication.save();
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err.message
        }
    }
}