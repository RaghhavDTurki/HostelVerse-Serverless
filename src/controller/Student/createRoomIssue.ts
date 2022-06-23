import * as Sentry from "@sentry/node";
import { CreateRoomIssueInput } from "../../types/ValidationInput";
import { RoomIssue } from "../../models/RoomIssue.model";
import { Student } from "../../models/Student.model";

export const createRoomIssue = async (body: CreateRoomIssueInput) => {
    try {
        const student = await Student.findOne({ studentid: body.studentid }).lean();
        if (!student.roomAlloted) {
            return {
                error: true,
                message: "Student is not allotted a room"
            };
        }
        const roomIssue = new RoomIssue({
            hostelid: student.hostelid,
            roomno: student.roomid,
            remarks: body.remarks,
        });
        await roomIssue.save();
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