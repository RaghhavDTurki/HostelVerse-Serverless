import * as Sentry from "@sentry/node";
import { CreateRoomIssueInput } from "../../types/ValidationInput";
import { RoomIssue } from "../../models/RoomIssue.model";

export const createRoomIssue = async (body: CreateRoomIssueInput) => {
    try{
        const roomIssue = new RoomIssue(body);
        await roomIssue.save();
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