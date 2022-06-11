import * as Sentry from "@sentry/node"; 
import { RoomIssue } from "../../models/RoomIssue.model";
import { Student } from "../../models/Student.model";

export const getStudentRoomIssue = async(studentid: string) => {
    try{
        if(!studentid){
            return {
                error: true,
                message: "Student id is required!"
            };
        }
        const student = await Student.findOne({
            studentid: studentid
        }).select("-_id -__v").lean();
        if(!student){
            return {
                error: true,
                message: "Student not found!"
            };
        }
        if(!student.roomAlloted){
            return {
                error: true,
                message: "Student is not allotted a room!"
            };
        }
        const roomIssue = await RoomIssue.findOne({
            studentid: studentid
        }).select("-_id -__v").lean();
        if(!roomIssue){
            return {
                error: true,
                message: "No room issue found!"
            };
        }
        return {
            error: false,
            data: roomIssue
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
};