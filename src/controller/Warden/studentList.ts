import * as Sentry from "@sentry/node";
import { Warden } from "../../models/Warden.model";
import { Student } from "../../models/Student.model";

export const getStudents = async (studentid: string, wardenid: string) => {
    try {
        if(!wardenid){
            return {
                error: true,
                message: "Warden id is required!"
            }
        }
        const wardenHostel = await Warden.findOne({ wardenid: wardenid }).select("hostelid").lean();
        if(studentid){
            const student = await Student.findOne({
                studentid: studentid,
                hostelid: wardenHostel.hostelid
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
       else{
            const students = await Student.find().select("-_id -__v").lean();
            return {
                error: false,
                data: students
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