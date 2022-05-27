import * as Sentry from "@sentry/node";
import { Student } from "../../models/Student.model";

export const getStudentProfile = async (studentid: string) => {
    try {
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
        return {
            error: false,
            data: student
        };
    } 
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };                  
    }
}

export const updateStudentProfile = async (studentid: string, body: any) => {
    try{
        if(!studentid){
            return {
                error: true,
                message: "Student id is required!"
            }
        }
        const student = await Student.findOneAndUpdate({
            studentid: studentid
        }, body, { new: true }).select("-_id -__v").lean();
        if(!student){
            return {
                error: true,
                message: "Student not found!"
            }
        }
        return {
            error: false,
            data: student
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