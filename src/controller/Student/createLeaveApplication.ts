import * as Sentry from "@sentry/node";
import { LeaveApplication } from "../../models/LeaveApplication.model";
import { CreateLeaveApplicationInput } from "../../types/ValidationInput";

export const createLeaveApplication = async (body: CreateLeaveApplicationInput) => {
    try {
        const leaveApplication = new LeaveApplication(body);
        await leaveApplication.save();
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err.message
        }
    }
}