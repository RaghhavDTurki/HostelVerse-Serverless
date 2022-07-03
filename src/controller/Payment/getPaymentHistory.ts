import * as Sentry from "@sentry/node";
import { Payment } from "../../models/Payment.model";

export const getPaymentHistory = async (studentid: string) => {
    try {
        if (!studentid) {
            return {
                error: true,
                message: "Student id is required!"
            };
        }
        const payments = await Payment.find({ studentid: studentid, status: "Paid" }).select("-_id -__v").lean();
        return {
            error: false,
            message: "Transaction history fetched successfully!",
            data: payments
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err.message
        };
    }
};