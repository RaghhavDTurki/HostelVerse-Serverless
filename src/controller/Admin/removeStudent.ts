import * as Sentry from '@sentry/node';
import { Student } from '../../models/Student.model';
import { Hostel } from '../../models/Hostel.model';
import { Room } from '../../models/Room.model';
import { Attendence } from '../../models/Attendence.model';

export const removeStudent = async (studentid: string) => {
    try{
        if(!studentid){
            return {
                error: true,
                message: 'Student id is required'
            };
        }
        const student = await Student.findOne({ studentid: studentid });
        if(!student){
            return {
                error: true,
                message: 'Student not found'
            };
        }
        if(student.roomAlloted){
            const room = await Room.findOne({ roomno: student.roomid});
            if(room.occupants.length > 1){
                room.occupants.splice(room.occupants.indexOf(studentid), 1);
                await room.save();
            }
            else{
                room.occupants.pop();
                room.allotmentstatus = false;
                await room.save();
            }
            const hostel = await Hostel.findOne({ hostelid: room.hostelid });
            if(room.type == "single"){
                hostel.singleRoomsLeft++;
            }
            else if(room.type == "double"){
                hostel.doubleRoomsLeft++;
            }
            else if(room.type == "triple"){
                hostel.tripleRoomsLeft++;
            }
            await hostel.save();
        }
        const attendence = await Attendence.findOneAndDelete({ studentid: studentid });
        student.delete();
        return {
            error: false,
            message: 'Student removed successfully'
        }
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }
}