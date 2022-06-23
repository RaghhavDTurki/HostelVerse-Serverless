import * as Sentry from "@sentry/node";
import { LeaveApplication } from "../../models/LeaveApplication.model";
import { Warden } from "../../models/Warden.model";
import { UpdateLeaveApplication } from "../../types/ValidationInput";

export const getLeaveApplications = async (studentid: string, wardenid: string) => {
    try {
        if (!wardenid) {
            return {
                error: true,
                message: "Warden id is required!"
            };
        }
        const wardenHostel = await Warden.findOne({ wardenid: wardenid }).select("hostelid").lean();
        if (studentid) {
            const leaveApplication = await LeaveApplication.findOne({
                studentid: studentid,
                hostelid: wardenHostel.hostelid
            }).select("-_id -__v").lean();
            if (!leaveApplication) {
                return {
                    error: true,
                    message: "Student not found!"
                };
            }
            return {
                error: false,
                data: leaveApplication
            };
        }
        else {
            const leaveApplications = await LeaveApplication.find({ hostelid: wardenHostel.hostelid }).lean();
            return {
                error: false,
                data: leaveApplications
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

export const updateLeaveApplication = async (body: UpdateLeaveApplication) => {
    try {
        if (!body.studentid) {
            return {
                error: true,
                message: "Student id is required!"
            };
        }
        const wardenHostel = await Warden.findOne({ wardenid: body.wardenid }).select("hostelid").lean();
        const leaveApplication = await LeaveApplication.findOne({
            studentid: body.studentid,
            hostelid: wardenHostel.hostelid,
            status: "Pending"
        });
        if (!leaveApplication) {
            return {
                error: true,
                message: "Student not found!"
            };
        }
        leaveApplication.status = body.status;
        leaveApplication.seenBy = body.name;
        leaveApplication.remarks = body.remarks;
        await leaveApplication.save();
        return {
            error: false,
            data: leaveApplication
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
    }
};