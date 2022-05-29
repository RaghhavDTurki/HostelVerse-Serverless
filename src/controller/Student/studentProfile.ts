import * as Sentry from "@sentry/node";
import { Student, StudentDocument } from "../../models/Student.model";
import { Attendence } from "../../models/Attendence.model";

function isToday(date: Date) {
    return date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
}
async function getAttendenceStatus(Student: StudentDocument){
    try{
        const attendence = await Attendence.findOne({ studentid: Student.studentid }).select("-_id -__v").lean();
        const lastCheckIn = attendence.last_checkin;
        const lastCheckOut = attendence.last_checkout;
        let studentLocation = "";
        if(lastCheckIn == null || lastCheckOut == null){
            studentLocation = "Not checked in";
        }
        if(!isToday(lastCheckIn || lastCheckOut)){
            studentLocation = "Not in Hostel";
        }
        if(lastCheckOut > lastCheckIn || lastCheckOut == null){
            studentLocation = "Not in Hostel";
        }
        else if(lastCheckIn.getHours() >= 21){
            studentLocation = "Not in Hostel";
        }
        else{
            studentLocation = "In Hostel";
        }
        return {
            error: false,
            data: studentLocation
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
        }).select("-_id -__v");
        if(!student){
            return {
                error: true,
                message: "Student not found!"
            }
        }   
        const attendenceStatus = await getAttendenceStatus(student);
        return {
            error: false,
            data: {
                student,
                attendenceStatus
            }
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