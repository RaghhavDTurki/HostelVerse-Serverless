import * as Sentry from "@sentry/node";
import { Room } from "../../models/Room.model";
import { RoomIssue } from "../../models/RoomIssue.model";
import { Hostel } from "../../models/Hostel.model";
import { Warden } from "../../models/Warden.model";

async function OccupancyRate() {
    try {
        const hostels = await Hostel.find({}).select("-_id -__v").lean();
        const hostelids = hostels.map(hostel => hostel.hostelid);
        const stats = [];
        const cursor = await Room.aggregate([
            {
                $match: { "allotmentstatus": true }
            },
            {
                $group: {
                    _id: "$hostelid",
                    count: { $sum: 1 }
                }
            }
        ]);
        for (const hostelid of hostelids) {
            let occupied = 0;
            for (const stat of cursor) {
                if (stat._id == hostelid) {
                    occupied = stat.count;
                    break;
                }
            }
            const hostel = hostels.find(hostel => hostel.hostelid == hostelid);
            const warden = await Warden.findOne({ hostelid: hostelid }).select("-_id -__v").lean();
            const totalRooms = hostel.singleRooms + hostel.doubleRooms + hostel.tripleRooms;
            const occupancyRate = (occupied / totalRooms) * 100;
            stats.push({
                hostelid: hostelid,
                hostelname: hostel.name,
                wardenid: hostel.wardenid,
                wardenname: warden ? warden.name : "",
                occupancyRate: occupancyRate
            });
        }
        return {
            error: false,
            message: "Occupancy rate fetched successfully!",
            data: stats
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
}

async function IssueClearanceRate() {
    try {
        const hostels = await Hostel.find({}).select("-_id -__v").lean();
        const hostelids = hostels.map(hostel => hostel.hostelid);
        const stats = [];
        for (const hostelid of hostelids) {
            const warden = await Warden.findOne({ hostelid: hostelid }).select("-_id -__v").lean();
            const totalIssues = await RoomIssue.countDocuments({ hostelid: hostelid });
            const solvedIssues = await RoomIssue.countDocuments({ hostelid: hostelid, status: "Resolved" });
            const issueClearanceRate = (solvedIssues / totalIssues) * 100;
            stats.push({
                hostelid: hostelid,
                hostelname: hostels.find(hostel => hostel.hostelid == hostelid).name,
                wardenid: warden.wardenid,
                wardenname: warden.name,
                totalIssues: totalIssues,
                issueClearanceRate: issueClearanceRate
            });
        }
        return {
            error: false,
            message: "Issue clearance rate fetched successfully!",
            data: stats
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
}

export const adminDashboard = async () => {
    try {
        const occupancyRate = await OccupancyRate();
        if (occupancyRate.error) {
            return occupancyRate;
        }
        const issueClearanceRate = await IssueClearanceRate();
        if (issueClearanceRate.error) {
            return issueClearanceRate;
        }
        return {
            error: false,
            message: "Dashboard fetched successfully!",
            data: {
                occupancyRate: occupancyRate.data,
                issueClearanceRate: issueClearanceRate.data
            }
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