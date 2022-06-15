import * as Sentry from "@sentry/node";
import { Student, StudentDocument } from "../../models/Student.model";
import { Attendence } from "../../models/Attendence.model";
import { UpdateStudentProfile } from "../../types/ValidationInput";

function isToday(date: Date) {
    return date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
}
async function getAttendenceStatus(Student: StudentDocument) {
    try {
        const attendence = await Attendence.findOne({ studentid: Student.studentid }).select("-_id -__v").lean();
        const lastCheckIn = attendence.last_checkin;
        const lastCheckOut = attendence.last_checkout;
        let studentLocation = "";
        if (lastCheckIn == null || lastCheckOut == null) {
            studentLocation = "Not checked in";
        }
        else if (!isToday(lastCheckIn || lastCheckOut)) {
            studentLocation = "Not in Hostel";
        }
        else if (lastCheckOut > lastCheckIn || lastCheckOut == null) {
            studentLocation = "Not in Hostel";
        }
        else if (lastCheckIn.getHours() >= 21) {
            studentLocation = "Not in Hostel";
        }
        else {
            studentLocation = "In Hostel";
        }
        return {
            error: false,
            data: studentLocation
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

export const getStudentProfile = async (studentid: string) => {
    try {
        if (!studentid) {
            return {
                error: true,
                message: "Student id is required!"
            };
        }
        const student = await Student.findOne({
            studentid: studentid
        }).select("-_id -__v");
        if (!student) {
            return {
                error: true,
                message: "Student not found!"
            };
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
};

export const updateStudentProfile = async (body: UpdateStudentProfile) => {
    try {
        if (!body.studentid) {
            return {
                error: true,
                message: "Student id is required!"
            };
        }
        const student = await Student.findOne({
            studentid: body.studentid
        });
        if (!student) {
            return {
                error: true,
                message: "Student not found!"
            };
        }
        if (body.name) {
            student.profile.name = body.name;
        }
        if (body.contactno) {
            student.profile.contactno = body.contactno;
        }
        if (body.gender) {
            student.profile.gender = body.gender;
        }
        if (body.githubHandle || body.githubHandle == "") {
            student.profile.githubHandle = body.githubHandle;
        }
        if (body.twitterHandle || body.twitterHandle == "") {
            student.profile.twitterHandle = body.twitterHandle;
        }
        if (body.linkedinHandle || body.linkedinHandle == "") {
            student.profile.linkedinHandle = body.linkedinHandle;
        }
        if (body.instagramHandle || body.instagramHandle == "") {
            student.profile.instagramHandle = body.instagramHandle;
        }
        if (body.description || body.description == "") {
            student.profile.description = body.description;
        }
        await student.save();
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
};