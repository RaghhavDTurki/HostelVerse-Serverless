import { Hostel } from "../../models/Hostel.model";

export async function getHostelList(): Promise<typeof hostelList> {
    const hostelList = await Hostel.find({}, null, { sort: { hostelid: 1 } }).select("-_id -__v").lean();
    return hostelList;
}

export async function getHostel(hostelid: string){
    try{
        if(!hostelid){
            return;
        }
        const hostel = await Hostel.findOne({ hostelid: hostelid }).select("-_id -__v").lean();
        return hostel;
    }
    catch(err){
        console.log("Error occured while getting Hostel: " + err);
    }
}