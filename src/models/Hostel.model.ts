import mongoose from "mongoose";

export type HostelDocument = mongoose.Document & {
    hostelid: string;
    name: string;
    location: string;
    wardenid: string | null;
    description: string;
    totalCapacity: number;
    singleRooms: number;
    doubleRooms: number;
    tripleRooms: number;
    singleRoomsLeft: number;
    doubleRoomsLeft: number;
    tripleRoomsLeft: number;
    fees: number;
    overallRating: number;
    numberOfReviews: number;
    image: string;
};


const HostelSchema = new mongoose.Schema<HostelDocument>(
    {
        hostelid: { type: String, unique: true },
        name: String,
        location: String,
        wardenid: String,
        description: String,
        totalCapacity: Number,
        singleRooms: { type: Number, default: 0 },
        doubleRooms: { type: Number, default: 0 },
        tripleRooms: { type: Number, default: 0 },
        singleRoomsLeft: Number,
        doubleRoomsLeft: Number,
        tripleRoomsLeft: Number,
        fees: Number,
        overallRating: { type: Number, default: 0 },
        numberOfReviews: { type: Number, default: 0 },
        image: String
    }
);

export const Hostel = mongoose.model<HostelDocument>("Hostel", HostelSchema);