import * as Sentry from "@sentry/node";
import { Warden } from "../../models/Warden.model";
import { RoomIssue } from "../../models/RoomIssue.model";
import { UpdateRoomIssue } from "../../types/ValidationInput";

export const getRoomIssues = async (wardenid: string, id?: string) => {
    try {
        if (!wardenid) {
            return {
                error: true,
                message: "Warden id is required!"
            };
        }
        const wardenHostel = await Warden.findOne({ wardenid: wardenid }).select("hostelid").lean();
        if (id) {
            const roomIssue = await RoomIssue.findOne({
                _id: id,
                hostelid: wardenHostel.hostelid
            }).select("-_id -__v").lean();
            if (!roomIssue) {
                return {
                    error: true,
                    message: "Room issue not found!"
                };
            }
            return {
                error: false,
                data: roomIssue
            };
        }
        const roomIssues = await RoomIssue.find({
            hostelid: wardenHostel.hostelid
        }).select("-__v").lean();
        if (!roomIssues) {
            return {
                error: true,
                message: "Room issues not found!"
            };
        }
        return {
            error: false,
            data: roomIssues
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

export const updateRoomIssue = async (body: UpdateRoomIssue) => {
    try {
        const roomIssue = await RoomIssue.findOne({
            _id: body.id,
            // hostelid: body.hostelid,
            // roomno: body.roomno,
            status: {
                "$in": ["Pending", "Assigned"]
            }
        });
        if (!roomIssue) {
            return {
                error: true,
                message: "Room issue not found!"
            };
        }
        await roomIssue.updateOne(body, {
            upsert: false
        });
        return {
            error: false,
            data: roomIssue
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