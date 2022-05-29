import * as Sentry from "@sentry/node";
import { Attendence } from "../../models/Attendence.model";
import { Student } from "../../models/Student.model";
import { Warden } from "../../models/Warden.model";

function isToday(date: Date) {
    return date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
}

export const studentAttendence = async (wardenid: string) => {
    try{
        if(!wardenid){
            return {
                error: true,
                message: "Warden id is required!"
            }
        }
        const warden = await Warden.findOne({ wardenid: wardenid }).select("-_id -__v").lean();
        if(!warden){
            return {
                error: true,
                message: "Warden not found!"
            }
        }
        const wardenHostel = warden.hostelid;
        const students = await Student.find({ hostelid: wardenHostel }).select("-_id -__v").lean();
        let studentsAttendence = [];
        for(let i = 0; i < students.length; i++){
            const student = students[i];
            const attendence = await Attendence.findOne({ studentid: student.studentid }).select("-_id -__v").lean();
            if(!attendence){
                continue;
            }
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
            studentsAttendence.push({
                studentid: student.studentid,
                name: student.profile.name,
                location: studentLocation
            })
        }
        return {
            error: false,
            message: "Students attendence fetched successfully!",
            data: studentsAttendence
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
}