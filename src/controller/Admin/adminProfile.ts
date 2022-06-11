import { Admin } from "../../models/Admin.model";
import * as Sentry from "@sentry/node";

export const getAdminProfile = async (adminid: string) => {
    try{
        if(!adminid)
        {
            return {
                error: true,
                message: "Admin id is required!"
            };
        }
        const admin = await Admin.findOne({
            adminid: adminid
        }).select("-_id -__v").lean();
        if(!admin)
        {
            return {
                error: true,
                message: "Admin not found!"
            };
        }
        return {
            error: false,
            data: admin
        };
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }
};