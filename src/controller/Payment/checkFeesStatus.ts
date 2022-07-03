import * as Sentry from "@sentry/node";
import { Payment } from "../../models/Payment.model";
import { SemesterSchedule } from "../../models/SemesterSchedule.model";

export const checkFeesStatus = async (studentid: string) => {
    try {
        if (!studentid) {
            return {
                error: true,
                message: "Student id is required!"
            };
        }
        const thisSemester = await SemesterSchedule.find({}).sort({ year: -1, no: -1 }).limit(1).lean();
        const thisSemesterAllotDate = thisSemester[0].allotDate;
        const thisSemesterPaymentDeadline = thisSemester[0].paymentDeadline;
        const allOrders = await Payment.find({ studentid: studentid, status: "Paid" }).select("-_id -__v");
        const filteredOrders = allOrders.filter(order => order.updatedAt >= thisSemesterAllotDate && order.updatedAt <= thisSemesterPaymentDeadline);
        if (filteredOrders.length > 0) {
            return {
                error: false,
                paid: true,
                message: "You have paid fees for this semester!"
            };
        }
        else {
            return {
                error: false,
                paid: false,
                message: "You have not paid for this semester!"
            };
        }
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err.message
        };
    }
}