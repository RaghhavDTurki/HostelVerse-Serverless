import * as Sentry from '@sentry/node';
import { Warden } from '../../models/Warden.model';
import { DeleteWardenInput } from '../../types/ValidationInput';

export const deleteWarden = async (body: DeleteWardenInput) => {
    try {
        const warden = await Warden.findOneAndDelete({
            wardenId: body.wardenid
        });
        if(!warden){
            return {
                error: true,
                message: "Warden not found!"
            };
        }
        return {
            error: false,
            message: "Warden deleted successfully!"
        };
    } 
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        }
    }
}