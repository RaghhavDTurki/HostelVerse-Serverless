import * as Sentry from '@sentry/node';
import { Warden } from '../../models/Warden.model';
import { CreateWardenInput } from '../../types/ValidationInput';
import { HostelModel } from '../../models/Hostel.model';

export const createWarden = async (body: CreateWardenInput) => {
    try{
        if(await Warden.findOne({ email: body.email })){
            return {
                error: true,
                message: "Warden already exists!"
            }
        }
        const newWarden = new Warden();
        newWarden.email = body.email;
        newWarden.name = body.name;
        newWarden.hostelid = body.hostelid;
        newWarden.password = body.password;
        newWarden.profile.name = body.name;
        newWarden.profile.email = body.email;
        newWarden.profile.contactno = body.contactno;
        newWarden.wardenid = body.wardenid;
        await newWarden.save();

        const hostel = await HostelModel.findOne({ hostelid: body.hostelid });
        hostel.wardenid = newWarden.wardenid
        await hostel.save();
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err.message
        }
    }
}
