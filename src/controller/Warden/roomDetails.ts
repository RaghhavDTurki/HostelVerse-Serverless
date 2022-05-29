import * as Sentry from "@sentry/node";
import { Room } from "../../models/Room.model";
import { Student } from "../../models/Student.model";
import { Warden } from "../../models/Warden.model";

export const roomDetail = async (wardenid: string, roomid: string) => {
    try{
        if(!wardenid){
            return {
                error: true,
                message: "Warden id is required!"
            }
        }
        const warden = await Warden.findOne({ wardenid: wardenid }).select("-_id -__v").lean();
        if(!warden){
            return {
                error: true,
                message: "Warden not found!"
            };
        }
        const wardenHostel = warden.hostelid;
        if(roomid){
            const room = await Room.findOne({ roomid: roomid }).select("-_id -__v").lean();
            let roomDetailItem;
            if(!room){
                return {
                    error: true,
                    message: "Room not found!"
                }
            }
            if(room.allotmentstatus == false){
                roomDetailItem = {
                    hostelid: wardenHostel,
                    roomno: room.roomno,
                    allotmentStatus: room.allotmentstatus
                }
                return {
                    error: false,
                    message: "Room is not allotted!",
                    data: roomDetailItem
                }
            }
            const students = await Student.find({ hostelid: wardenHostel, roomid: roomid }).select("-_id -__v").lean();
            roomDetailItem = {
                hostelid: wardenHostel,
                roomno: room.roomno,
                allotmentStatus: room.allotmentstatus,
                occupants: students
            }
            return {
                error: false,
                message: "Room detail fetched successfully!",
                data: roomDetailItem
            };
        }
        else{
            const rooms = await Room.find({ hostelid: wardenHostel }).select("-_id -__v").lean();
            let roomsDetail = [];
            for(let i = 0; i < rooms.length; i++){
                const room = rooms[i];
                let roomDetailItem;
                if(room.allotmentstatus == false){
                    roomDetailItem = {
                        hostelid: wardenHostel,
                        roomno: room.roomno,
                        allotmentStatus: room.allotmentstatus
                    }
                    roomsDetail.push(roomDetailItem);
                }
                else{
                    const students = await Student.find({ hostelid: wardenHostel, roomid: room.roomno }).select("-_id -__v").lean();
                    roomDetailItem = {
                        hostelid: wardenHostel,
                        roomno: room.roomno,
                        allotmentStatus: room.allotmentstatus,
                        occupants: students
                    }
                    roomsDetail.push(roomDetailItem);
                }
            }
            return {
                error: false,
                message: "Rooms detail fetched successfully!",
                data: roomsDetail
            };
        }
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        }
    }
}