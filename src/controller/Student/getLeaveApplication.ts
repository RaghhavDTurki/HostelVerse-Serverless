import * as Sentry from "@sentry/node"; 
import { LeaveApplication } from "../../models/LeaveApplication.model";
import { Student } from "../../models/Student.model";

export const getStudentLeaveApplication = async(studentid: string) => {
    try{
        if(!studentid){
            return {
                error: true,
                message: "Student id is required!"
            }
        }
        const student = await Student.findOne({
            studentid: studentid
        }).select("-_id -__v").lean();
        if(!student){
            return {
                error: true,
                message: "Student not found!"
            }
        }
        if(!student.roomAlloted){
            return {
                error: true,
                message: "Student is not allotted a room!"
            }
        }
        const leaveApplication = await LeaveApplication.findOne({
            studentid: studentid
        }).select("-_id -__v").lean();
        if(!leaveApplication){
            return {
                error: true,
                message: "No leave application found!"
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
        return {
            error: true,
            message: err
        }
    }
}