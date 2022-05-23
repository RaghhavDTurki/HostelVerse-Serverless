import { HostelDocument, HostelInput, HostelModel } from "../../models/Hostel.model";
import * as Sentry from "@sentry/node";

export async function createHostel(body: HostelInput){
    let hostel: HostelDocument;
    try{
        hostel = new HostelModel();
        hostel.hostelid = body.hostelid;
        hostel.name = body.name;
        hostel.location = body.location;
        hostel.description = body.description;
        hostel.totalCapacity = +body.totalCapacity;
        if(body.singleRooms){
            hostel.singleRooms = +body.singleRooms;
            hostel.singleRoomsLeft = +body.singleRooms;
        }
        if(body.doubleRooms){
            hostel.doubleRooms = +body.doubleRooms;
            hostel.doubleRoomsLeft = +body.doubleRooms;
        }
        if(body.tripleRooms){
            hostel.tripleRooms = +body.tripleRooms;
            hostel.tripleRoomsLeft = +body.tripleRooms;
        }
        hostel.fees = +body.fees;
        
        if(body.wardenid){
            hostel.wardenid = body.wardenid;
        }
        await hostel.save()
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return true;
    }
}