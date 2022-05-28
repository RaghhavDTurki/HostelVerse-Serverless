import * as Sentry from "@sentry/node";
import { Student } from "../../models/Student.model";
import { Hostel } from "../../models/Hostel.model";
import { Room } from "../../models/Room.model";
import { AllotHostelInput } from "../../types/ValidationInput";

export const allotHostel = async (body: AllotHostelInput) => {
    try{
        const hostels = body.hostelid;
        const batches = body.batch;
        if(hostels.length != batches.length){
            return {
                error: true,
                message: "Hostel and batch should be same length!"
            }
        }
        for(let i = 0; i < hostels.length; i++)
        {
            const hostelid = hostels[i];
            const batch = batches[i];
            const studentsEnrolled = await Student.find({ batch: batch, roomAlloted: false }, null, { sort: { distance: -1 } }).select("-_id -__v");
            const hostel = await Hostel.findOne({ hostelid: hostelid }).select("-_id -__v");
            const roomList = await Room.find({ hostelid: hostelid, allotmentstatus: false });
            let studentCounter = 0;
            if(studentsEnrolled.length > hostel.totalCapacity){
                for(let i = 0; i < roomList.length; i++)
                {
                    const room = roomList[i];
                    if(room.type == "single"){
                        if(studentCounter < studentsEnrolled.length){
                            const student = studentsEnrolled[studentCounter];
                            student.roomAlloted = true;
                            student.roomid = room.roomno;
                            student.hostelid = hostel.hostelid;
                            room.occupants.push(student.studentid);
                            room.allotmentstatus = true;
                            await room.save();
                            await student.save();
                            await hostel.updateOne({ hostelid: hostelid }, { $inc: { singleRoomsLeft: -1 } });
                            studentCounter++;
                        }
                    }
                    else if(room.type == "double"){
                        if(studentCounter < studentsEnrolled.length){
                            const student1 = studentsEnrolled[studentCounter];
                            student1.roomAlloted = true;
                            student1.roomid = room.roomno;
                            student1.hostelid = hostel.hostelid;
                            room.occupants.push(student1.studentid);
                            studentCounter++;
                            await student1.save();
                        }
                        if(studentCounter < studentsEnrolled.length){
                            const student2 = studentsEnrolled[studentCounter];
                            student2.roomAlloted = true;
                            student2.roomid = room.roomno;
                            student2.hostelid = hostel.hostelid;
                            room.occupants.push(student2.studentid);
                            studentCounter++;
                            await student2.save();
                        }
                        room.allotmentstatus = true;
                        await room.save();
                        await hostel.updateOne({ hostelid: hostelid }, { $inc: { doubleRoomsLeft: -1 } });
                    }
                    else if(room.type == "triple"){
                        if(studentCounter < studentsEnrolled.length){
                            const student1 = studentsEnrolled[studentCounter];
                            student1.roomAlloted = true;
                            student1.roomid = room.roomno;
                            student1.hostelid = hostel.hostelid;
                            room.occupants.push(student1.studentid);
                            studentCounter++;
                            await student1.save();
                        }
                        if(studentCounter < studentsEnrolled.length){
                            const student2 = studentsEnrolled[studentCounter];
                            student2.roomAlloted = true;
                            student2.roomid = room.roomno;
                            student2.hostelid = hostel.hostelid;
                            room.occupants.push(student2.studentid);
                            studentCounter++;
                            await student2.save();
                        }
                        if(studentCounter < studentsEnrolled.length){
                            const student3 = studentsEnrolled[studentCounter];
                            student3.roomAlloted = true;
                            student3.roomid = room.roomno;
                            student3.hostelid = hostel.hostelid;
                            room.occupants.push(student3.studentid);
                            studentCounter++;
                            await student3.save();
                        }
                        room.allotmentstatus = true;
                        await room.save();
                        await hostel.updateOne({ hostelid: hostelid }, { $inc: { tripleRoomsLeft: -1 } });
                    }
                }
                return {
                    error: false,
                    message: "Hostel allotted successfully!"
                }
            }
            else{
                const totalStudents = studentsEnrolled.length;  // 85
                const singleCapacity = hostel.singleRooms; // 35
                const doubleCapacity = hostel.doubleRooms * 2; // 60
                const tripleCapacity = hostel.tripleRooms * 3; // 0
                const singleStudents = Math.round(totalStudents * singleCapacity / hostel.totalCapacity); // 31
                const doubleStudents = Math.round(totalStudents * doubleCapacity / hostel.totalCapacity); // 54
                const tripleStudents = Math.round(totalStudents * tripleCapacity / hostel.totalCapacity); // 0
                if(singleStudents > 0){
                    const singleRooms = await Room.find({ hostelid: hostelid, type: "single", allotmentstatus: false }).select("-_id -__v");
                    let singleCounter = 0;
                    for(let i = 0; i < singleRooms.length; i++){
                        const room = singleRooms[i];
                        if(singleCounter < singleStudents){
                            const student = studentsEnrolled[singleCounter];
                            student.roomAlloted = true;
                            student.roomid = room.roomno;
                            student.hostelid = hostel.hostelid;
                            room.occupants.push(student.studentid);
                            singleCounter++;
                            await student.save();
                        }
                        room.allotmentstatus = true;
                        await room.save();
                        await hostel.updateOne({ hostelid: hostelid }, { $inc: { singleRoomsLeft: -1 } });
                    }
                }
                if(doubleStudents > 0){
                    const doubleRooms = await Room.find({ hostelid: hostelid, type: "double", allotmentstatus: false }).select("-_id -__v");
                    let doubleCounter = 0;
                    for(let i = 0; i < doubleRooms.length; i++){
                        const room = doubleRooms[i];
                        if(doubleCounter < doubleStudents){
                            const student1 = studentsEnrolled[doubleCounter];
                            student1.roomAlloted = true;
                            student1.roomid = room.roomno;
                            student1.hostelid = hostel.hostelid;
                            room.occupants.push(student1.studentid);
                            doubleCounter++;
                            await student1.save();
                        }
                        if(doubleCounter < doubleStudents){
                            const student2 = studentsEnrolled[doubleCounter];
                            student2.roomAlloted = true;
                            student2.roomid = room.roomno;
                            student2.hostelid = hostel.hostelid;
                            room.occupants.push(student2.studentid);
                            doubleCounter++;
                            await student2.save();
                        }
                        room.allotmentstatus = true;
                        await room.save();
                        await hostel.updateOne({ hostelid: hostelid }, { $inc: { doubleRoomsLeft: -1 } });
                    }
                }
                if(tripleStudents > 0){
                    const tripleRooms = await Room.find({ hostelid: hostelid, type: "triple", allotmentstatus: false }).select("-_id -__v");
                    let tripleCounter = 0;
                    for(let i = 0; i < tripleRooms.length; i++){
                        const room = tripleRooms[i];
                        if(tripleCounter < tripleStudents){
                            const student1 = studentsEnrolled[tripleCounter];
                            student1.roomAlloted = true;
                            student1.roomid = room.roomno;
                            student1.hostelid = hostel.hostelid;
                            room.occupants.push(student1.studentid);
                            tripleCounter++;
                            await student1.save();
                        }
                        if(tripleCounter < tripleStudents){
                            const student2 = studentsEnrolled[tripleCounter];
                            student2.roomAlloted = true;
                            student2.roomid = room.roomno;
                            student2.hostelid = hostel.hostelid;
                            room.occupants.push(student2.studentid);
                            tripleCounter++;
                            await student2.save();
                        }
                        if(tripleCounter < tripleStudents){
                            const student3 = studentsEnrolled[tripleCounter];
                            student3.roomAlloted = true;
                            student3.roomid = room.roomno;
                            student3.hostelid = hostel.hostelid;
                            room.occupants.push(student3.studentid);
                            tripleCounter++;
                            await student3.save();
                        }
                        room.allotmentstatus = true;
                        await room.save();
                        await hostel.updateOne({ hostelid: hostelid }, { $inc: { tripleRoomsLeft: -1 } });
                    }
                }
                return {
                    error: false,
                    message: "Hostel allotted successfully!"
                }
            }
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