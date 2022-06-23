import * as Sentry from "@sentry/node";
import { Student } from "../../models/Student.model";
import { Announcement } from "../../models/Announcement.model";

export const viewAnnouncement = async (studentid: string) => {
    try {
        if (!studentid) {
            return {
                error: true,
                message: "Student id is required!"
            };
        }
        const student = await Student.findOne({
            studentid: studentid
        }).select("-_id -__v").lean();
        if (!student) {
            return {
                error: true,
                message: "Student not found!"
            };
        }
        if (!student.roomAlloted) {
            return {
                error: true,
                message: "Student is not allotted a room!"
            };
        }
        const announcement = await Announcement.find({
            hostelid: student.hostelid
        }).select("-_id -__v").lean();
        if (!announcement) {
            return {
                error: true,
                message: "No announcements found!"
            };
        }
        return {
            error: false,
            data: announcement
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: JSON.stringify({
                error: err.message
            })
        };
    }
};