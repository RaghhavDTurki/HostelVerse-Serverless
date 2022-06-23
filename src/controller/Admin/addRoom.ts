import * as Sentry from "@sentry/node";
import { Room } from "../../models/Room.model";
import { CreateRoomInput } from "../../types/ValidationInput";
import { Hostel } from "../../models/Hostel.model";

export const addRoom = async (body: CreateRoomInput) => {
    try {
        if (await Room.findOne({ roomno: body.roomno, hostelid: body.hostelid })) {
            return {
                error: true,
                message: "Room already exists!"
            };
        }
        const newRoom = new Room();
        newRoom.roomno = body.roomno;
        newRoom.hostelid = body.hostelid;
        newRoom.type = body.type;
        if (body.updateOrAdd == "update") {

            await newRoom.save();
        }
        else if (body.updateOrAdd == "add") {
            const hostel = await Hostel.findOne({ hostelid: body.hostelid });
            if (body.type == "single") {
                hostel.singleRooms = hostel.singleRooms + 1;
                hostel.totalCapacity = hostel.totalCapacity + 1;
            }
            else if (body.type == "double") {
                hostel.doubleRooms = hostel.doubleRooms + 1;
                hostel.totalCapacity = hostel.totalCapacity + 2;
            }
            else if (body.type == "triple") {
                hostel.tripleRooms = hostel.tripleRooms + 1;
                hostel.totalCapacity = hostel.totalCapacity + 3;
            }
            await hostel.save();
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
