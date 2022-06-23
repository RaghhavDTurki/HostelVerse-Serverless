import { Student } from "../../models/Student.model";
import { Attendence } from "../../models/Attendence.model";
import * as Sentry from "@sentry/node";
import { getDistance } from "../../utils/getDistance";
import { CheckInInput, CheckOutInput } from "../../types/ValidationInput";


export const checkIn = async (body: CheckInInput) => {
    try {
        if (!body.studentid) {
            return {
                error: true,
                message: "Student id is required!"
            };
        }
        const student = await Student.findOne({
            studentid: body.studentid
        }).select("-_id -__v").lean();
        if (!student) {
            return {
                error: true,
                message: "Student not found!"
            };
        }
        const distance = await getDistance(body.location);
        if (distance > 1) {
            return {
                error: true,
                message: "You are too far from hostel!"
            };
        }
        const attendence = await Attendence.findOne({
            studentid: body.studentid
        });
        if (!attendence) {
            return {
                error: true,
                message: "Attendence not found!"
            };
        }
        const lastCheckIn = attendence.last_checkin;
        const lastCheckOut = attendence.last_checkout;
        if (lastCheckOut > lastCheckIn || lastCheckOut == null) {
            attendence.last_checkin = new Date();
            await attendence.save();
            return {
                error: false,
                message: "Checked in successfully!"
            };
        }
        else {
            return {
                error: true,
                message: "You have already checked in!"
            };
        }
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

export const checkOut = async (body: CheckOutInput) => {
    try {
        if (!body.studentid) {
            return {
                error: true,
                message: "Student id is required!"
            };
        }
        const student = await Student.findOne({
            studentid: body.studentid
        }).select("-_id -__v").lean();
        if (!student) {
            return {
                error: true,
                message: "Student not found!"
            };
        }
        const attendence = await Attendence.findOne({
            studentid: body.studentid
        });
        if (!attendence) {
            return {
                error: true,
                message: "Attendence not found!"
            };
        }
        const lastCheckIn = attendence.last_checkin;
        const lastCheckOut = attendence.last_checkout;
        if (lastCheckOut < lastCheckIn) {
            attendence.last_checkout = new Date();
            await attendence.save();
            return {
                error: false,
                message: "Checked Out successfully!"
            };
        }
        else {
            return {
                error: true,
                message: "You have already checked out!"
            };
        }
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